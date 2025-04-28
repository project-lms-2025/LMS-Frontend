import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { createTestWithQuestions, uploadImageToS3 } from '../../api/test'; // Import API functions
import { v4 as uuidv4 } from 'uuid';

const Test = () => {
    // Initialize form data with auto-generated UUIDs for test, question, and options
    const [formData, setFormData] = useState({
        test_id: uuidv4(), // Automatically generated test ID
        course_id: '',
        title: '',
        description: '',
        duration: '', // duration in minutes
        schedule_date: '',
        schedule_time: '',
        total_marks: '',
        questions: [
            {
                question_id: uuidv4(), // Automatically generated question ID
                section: '',
                question_text: '',
                question_type: '',
                positive_marks: '',
                negative_marks: '',
                image_url: '', // Image URL for the question
                options: [
                    { option_id: uuidv4(), option_text: '', image_url: '', is_correct: false },
                    { option_id: uuidv4(), option_text: '', image_url: '', is_correct: false }
                ]
            }
        ]
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Handler for uploading a question image
    const handleQuestionImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Use type 'question' and the question_id for uploading the question image
            const questionId = formData.questions[0].question_id;
            const url = await uploadImageToS3(file, formData.test_id, 'question', questionId);
            if (url) {
                setFormData((prev) => {
                    const updatedQuestions = [...prev.questions];
                    updatedQuestions[0].image_url = url;
                    return { ...prev, questions: updatedQuestions };
                });
            }
        }
    };

    // Handler for uploading an option image (optionIndex 0 or 1)
    const handleOptionImageUpload = async (e, optionIndex) => {
        const file = e.target.files[0];
        if (file) {
            const optionId = formData.questions[0].options[optionIndex].option_id;
            const url = await uploadImageToS3(file, formData.test_id, 'option', optionId);
            console.log(url)
            if (url) {
                setFormData((prev) => {
                    const updatedQuestions = [...prev.questions];
                    updatedQuestions[0].options[optionIndex].image_url = url;
                    return { ...prev, questions: updatedQuestions };
                });
            }
        }
    };

    // Handler for input changes. Manages both top-level and nested (question/option) fields.
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle nested fields for question and options
        if (name.startsWith('question_') || name.startsWith('option1_') || name.startsWith('option2_')) {
            setFormData((prev) => {
                const updatedQuestions = [...prev.questions];
                const question = { ...updatedQuestions[0] };

                if (name.startsWith('question_')) {
                    const field = name.replace('question_', '');
                    question[field] = type === 'checkbox' ? checked : value;
                } else if (name.startsWith('option1_')) {
                    const field = name.replace('option1_', '');
                    question.options[0] = { ...question.options[0], [field]: type === 'checkbox' ? checked : value };
                } else if (name.startsWith('option2_')) {
                    const field = name.replace('option2_', '');
                    question.options[1] = { ...question.options[1], [field]: type === 'checkbox' ? checked : value };
                }
                updatedQuestions[0] = question;
                return { ...prev, questions: updatedQuestions };
            });
        } else {
            // Handle top-level fields
            setFormData((prev) => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };

    // Handle form submission and call the createTestWithQuestions API
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const result = await createTestWithQuestions(formData);
            setMessage('Test created successfully!');
            console.log(formData);
        } catch (error) {
            console.error(error);
            setMessage('Error creating test.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create Test</h1>
            {message && (
                <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Test Details */}
                <div>
                    <label className="block mb-1 font-medium">Test ID</label>
                    <input
                        type="text"
                        name="test_id"
                        value={formData.test_id}
                        readOnly
                        className="w-full border p-2 rounded bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Course ID</label>
                    <input
                        type="text"
                        name="course_id"
                        value={formData.course_id}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="Enter course ID"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="Enter test title"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="Enter test description"
                        rows="3"
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium">Duration (minutes)</label>
                        <input
                            type="number"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            placeholder="Enter duration"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Total Marks</label>
                        <input
                            type="number"
                            name="total_marks"
                            value={formData.total_marks}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            placeholder="Enter total marks"
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium">Schedule Date</label>
                        <input
                            type="date"
                            name="schedule_date"
                            value={formData.schedule_date}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Schedule Time</label>
                        <input
                            type="time"
                            name="schedule_time"
                            value={formData.schedule_time}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                </div>

                <hr className="my-4" />

                {/* Question Details */}
                <h2 className="text-xl font-bold">Question</h2>
                <div>
                    <label className="block mb-1 font-medium">Question ID</label>
                    <input
                        type="text"
                        name="question_question_id"
                        value={formData.questions[0].question_id}
                        readOnly
                        className="w-full border p-2 rounded bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Section</label>
                    <input
                        type="text"
                        name="question_section"
                        value={formData.questions[0].section}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="Enter section"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Question Text</label>
                    <textarea
                        name="question_question_text"
                        value={formData.questions[0].question_text}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="Enter question text"
                        rows="2"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Question Type</label>
                    <input
                        type="text"
                        name="question_question_type"
                        value={formData.questions[0].question_type}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="e.g., multiple choice"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Question Image</label>
                    <input type="file" accept="image/*" onChange={handleQuestionImageUpload} className="w-full" />
                    {formData.questions[0].image_url && (
                        <img src={formData.questions[0].image_url} alt="Question" className="mt-2 h-24" />
                    )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium">Positive Marks</label>
                        <input
                            type="number"
                            name="question_positive_marks"
                            value={formData.questions[0].positive_marks}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            placeholder="Enter positive marks"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Negative Marks</label>
                        <input
                            type="number"
                            name="question_negative_marks"
                            value={formData.questions[0].negative_marks}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            placeholder="Enter negative marks"
                            required
                        />
                    </div>
                </div>

                {/* Option 1 */}
                <div className="mt-4">
                    <h3 className="text-lg font-bold">Option 1</h3>
                    <div>
                        <label className="block mb-1 font-medium">Option ID</label>
                        <input
                            type="text"
                            name="option1_option_id"
                            value={formData.questions[0].options[0].option_id}
                            readOnly
                            className="w-full border p-2 rounded bg-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Option Text</label>
                        <input
                            type="text"
                            name="option1_option_text"
                            value={formData.questions[0].options[0].option_text}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            placeholder="Enter option text"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Option Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleOptionImageUpload(e, 0)}
                            className="w-full"
                        />
                        {formData.questions[0].options[0].image_url && (
                            <img
                                src={formData.questions[0].options[0].image_url}
                                alt="Option 1"
                                className="mt-2 h-24"
                            />
                        )}
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="option1_is_correct"
                            checked={formData.questions[0].options[0].is_correct}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label className="font-medium">Is Correct</label>
                    </div>
                </div>

                {/* Option 2 */}
                <div className="mt-4">
                    <h3 className="text-lg font-bold">Option 2</h3>
                    <div>
                        <label className="block mb-1 font-medium">Option ID</label>
                        <input
                            type="text"
                            name="option2_option_id"
                            value={formData.questions[0].options[1].option_id}
                            readOnly
                            className="w-full border p-2 rounded bg-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Option Text</label>
                        <input
                            type="text"
                            name="option2_option_text"
                            value={formData.questions[0].options[1].option_text}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            placeholder="Enter option text"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Option Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleOptionImageUpload(e, 1)}
                            className="w-full"
                        />
                        {formData.questions[0].options[1].image_url && (
                            <img
                                src={formData.questions[0].options[1].image_url}
                                alt="Option 2"
                                className="mt-2 h-24"
                            />
                        )}
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="option2_is_correct"
                            checked={formData.questions[0].options[1].is_correct}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label className="font-medium">Is Correct</label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    <Send size={20} className="mr-2" />
                    {loading ? "Creating Test..." : "Create Test"}
                </button>
            </form>
        </div>
    );
};

export default Test;
