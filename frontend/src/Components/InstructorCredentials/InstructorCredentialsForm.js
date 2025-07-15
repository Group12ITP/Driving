import React, { useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';

const InstructorCredentialsForm = ({ instructor, onSubmit, onCancel }) => {
    const [form] = Form.useForm();

    // Set form fields when instructor changes
    useEffect(() => {
        if (instructor) {
            form.setFieldsValue({
                instructorId: instructor.instructorId,
                name: instructor.name,
                email: instructor.email,
                password: instructor.password, // Show password for editing
                instructorType: instructor.instructorType
            });
        } else {
            form.resetFields();
        }
    }, [instructor, form]);

    // Handle form submission
    const handleSubmit = (values) => {
        onSubmit(values);
    };

    // Instructor type options
    const instructorTypeOptions = [
        { value: 'Bike', label: 'Bike' },
        { value: 'BikeCar', label: 'Bike & Car' },
        { value: 'HeavyVehicle', label: 'Heavy Vehicle' }
    ];

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
                instructorType: 'Bike'
            }}
        >
            <Form.Item
                name="instructorId"
                label="Instructor ID"
                rules={[
                    { required: true, message: 'Please enter the instructor ID' }
                ]}
            >
                <Input placeholder="Enter instructor ID" />
            </Form.Item>

            <Form.Item
                name="name"
                label="Name"
                rules={[
                    { required: true, message: 'Please enter the instructor name' }
                ]}
            >
                <Input placeholder="Enter instructor name" />
            </Form.Item>

            <Form.Item
                name="email"
                label="Email"
                rules={[
                    { required: true, message: 'Please enter the instructor email' },
                    { type: 'email', message: 'Please enter a valid email' }
                ]}
            >
                <Input placeholder="Enter instructor email" />
            </Form.Item>

            <Form.Item
                name="password"
                label="Password"
                rules={[
                    { 
                        required: !instructor, 
                        message: 'Please enter a password' 
                    },
                    {
                        min: 6,
                        message: 'Password must be at least 6 characters'
                    }
                ]}
            >
                <Input 
                    placeholder={instructor ? "Leave blank to keep current password" : "Enter password"}
                />
            </Form.Item>

            <Form.Item
                name="instructorType"
                label="Instructor Type"
                rules={[
                    { required: true, message: 'Please select the instructor type' }
                ]}
            >
                <Select
                    placeholder="Select instructor type"
                    options={instructorTypeOptions}
                />
            </Form.Item>

            <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button type="primary" htmlType="submit">
                        {instructor ? 'Update' : 'Add'} Instructor
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
};

export default InstructorCredentialsForm; 