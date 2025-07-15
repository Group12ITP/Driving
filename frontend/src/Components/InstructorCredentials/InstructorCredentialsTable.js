import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, message, Space, Card } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined, ReloadOutlined, ExclamationCircleOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import InstructorCredentialsService from '../../services/InstructorCredentialsService';
import InstructorCredentialsForm from './InstructorCredentialsForm';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './InstructorCredentials.css';

const { confirm } = Modal;

const InstructorCredentialsTable = () => {
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentInstructor, setCurrentInstructor] = useState(null);
    const [modalTitle, setModalTitle] = useState('');
    const [error, setError] = useState(null);
    const componentRef = useRef();

    // Fetch all instructor credentials
    const fetchInstructors = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await InstructorCredentialsService.getAllInstructorCredentials();
            console.log('Raw response:', response);
            
            // Check the structure of the response
            if (response && response.data && Array.isArray(response.data)) {
                setInstructors(response.data);
            } else if (response && response.data && Array.isArray(response.data.data)) {
                setInstructors(response.data.data);
            } else if (Array.isArray(response)) {
                // Handle case where response might be an array directly
                setInstructors(response);
            } else {
                console.error('Unexpected response structure:', response);
                setError('Data structure is not as expected. Check console for details.');
                setInstructors([]);
            }
        } catch (error) {
            console.error('Failed to fetch instructor credentials:', error);
            setError(`Error fetching data: ${error.message}`);
            setInstructors([]);
            message.error('Failed to fetch instructor credentials');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstructors();
    }, []);

    // Handle add new instructor
    const handleAddInstructor = () => {
        setCurrentInstructor(null);
        setModalTitle('Add New Instructor');
        setIsModalVisible(true);
    };

    // Handle edit instructor
    const handleEditInstructor = (instructor) => {
        setCurrentInstructor(instructor);
        setModalTitle('Edit Instructor');
        setIsModalVisible(true);
    };

    // Show delete confirmation dialog
    const showDeleteConfirm = (record) => {
        const idToDelete = record._id || record.id;
        
        if (!idToDelete) {
            message.error('Cannot delete: No ID found for this record');
            return;
        }
        
        confirm({
            title: 'Are you sure you want to delete this instructor?',
            icon: <ExclamationCircleOutlined />,
            content: `This will permanently delete instructor ${record.name}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteInstructor(record);
            },
        });
    };
    
    // Handle the actual delete operation
    const deleteInstructor = async (record) => {
        try {
            // Log the record to see what fields are available
            console.log('Deleting record:', record);
            
            // Determine the ID to use for deletion
            const idToDelete = record._id || record.id;
            
            if (!idToDelete) {
                message.error('Cannot delete: No ID found for this record');
                return;
            }
            
            console.log('Deleting instructor with ID:', idToDelete);
            await InstructorCredentialsService.deleteInstructorCredential(idToDelete);
            message.success('Instructor deleted successfully');
            fetchInstructors();
        } catch (error) {
            console.error('Delete error:', error);
            message.error(`Failed to delete instructor: ${error.message}`);
        }
    };

    // Handle modal form submission
    const handleFormSubmit = async (values) => {
        try {
            if (currentInstructor) {
                // Log the current instructor to see what fields are available
                console.log('Updating instructor:', currentInstructor);
                
                // Determine the ID to use for update
                const idToUpdate = currentInstructor._id || currentInstructor.id;
                
                if (!idToUpdate) {
                    message.error('Cannot update: No ID found for this record');
                    return;
                }
                
                console.log('Updating instructor with ID:', idToUpdate);
                await InstructorCredentialsService.updateInstructorCredential(idToUpdate, values);
                message.success('Instructor updated successfully');
            } else {
                await InstructorCredentialsService.createInstructorCredential(values);
                message.success('Instructor added successfully');
            }
            setIsModalVisible(false);
            fetchInstructors();
        } catch (error) {
            console.error('Form submission error:', error);
            message.error(`Failed to save instructor: ${error.message}`);
        }
    };

    // Handle PDF report generation
    const handlePrintPdf = () => {
        const tableElement = document.querySelector('.ant-table-container');
        if (!tableElement || instructors.length === 0) {
            message.error('No instructor data to download');
            return;
        }

        html2canvas(tableElement).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4', true);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 30;

            // Add title and date
            pdf.setFontSize(18);
            pdf.text('Instructor Credentials Report', pdfWidth / 2, 15, { align: 'center' });
            pdf.setFontSize(12);
            pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pdfWidth / 2, 22, { align: 'center' });

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save('instructor-credentials-report.pdf');
            
            message.success('PDF report has been generated');
        });
    };

    // Table columns configuration
    const columns = [
        {
            title: 'Instructor ID',
            dataIndex: 'instructorId',
            key: 'instructorId',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Password',
            dataIndex: 'password',
            key: 'password',
        },
        {
            title: 'Instructor Type',
            dataIndex: 'instructorType',
            key: 'instructorType',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => text ? new Date(text).toLocaleDateString() : 'N/A',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        type="primary" 
                        icon={<EditOutlined />} 
                        onClick={() => handleEditInstructor(record)}
                    >
                        Edit
                    </Button>
                    <Button 
                        type="primary" 
                        danger 
                        icon={<DeleteOutlined />}
                        onClick={() => showDeleteConfirm(record)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="instructor-credentials-container">
            <div className="instructor-header">
                <h1>Instructor Credentials Management</h1>
                <Space>
                    <Button 
                        type="primary" 
                        icon={<UserAddOutlined />} 
                        onClick={handleAddInstructor}
                    >
                        Add New Instructor
                    </Button>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={fetchInstructors}
                    >
                        Refresh
                    </Button>
                    <Button
                        type="primary"
                        icon={<FilePdfOutlined />}
                        onClick={handlePrintPdf}
                    >
                        Download Report
                    </Button>
                </Space>
            </div>
            
            {error && (
                <Card style={{ marginBottom: 16, backgroundColor: '#fff2f0', borderColor: '#ffccc7' }}>
                    <p style={{ color: '#cf1322' }}>{error}</p>
                    <p>Please check your browser console for more details and ensure that your backend server is running.</p>
                </Card>
            )}
            
            <div ref={componentRef}>
                <Table 
                    columns={columns} 
                    dataSource={instructors} 
                    rowKey={(record) => record._id || record.id || Math.random().toString()} 
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: 'No instructor credentials found' }}
                />
            </div>
            
            <Modal
                title={modalTitle}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={700}
            >
                <InstructorCredentialsForm 
                    instructor={currentInstructor} 
                    onSubmit={handleFormSubmit} 
                    onCancel={() => setIsModalVisible(false)}
                />
            </Modal>
        </div>
    );
};

export default InstructorCredentialsTable; 