import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Loading from '../../components/Loading';
import { createPaymentOrder, getBatchById, getUserProfile, enrollUser } from '../../api/auth';

const BatchPayment = () => {
    const { batch_id } = useParams();
    const [batch, setBatch] = useState(null);
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const batchRes = await getBatchById(batch_id);
                console.log(batchRes.data);
                setBatch(batchRes.data);

                const userRes = await getUserProfile();
                setStudent(userRes.data);
            } catch (error) {
                toast.error("Failed to load batch or student data.");
                console.error("Data fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (batch_id) {
            fetchData();
        }
    }, [batch_id]);

    const handlePayment = async () => {
        try {
            const order = await createPaymentOrder({
                batch_id: batch.batch_id,
                amount: batch?.cost,
                currency: "INR",
            });

            const { id: order_id, amount, currency } = order.data;

            const options = {
                key: import.meta.env.VITE_Test_key_id,
                amount,
                currency,
                name: "TeacherTech",
                description: `Payment for batch: ${batch?.batch_name || ""}`,
                order_id,
                handler: async function (response) {
                    try {
                        toast.success(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);

                        const enrollmentPayload = {
                            batch_id: batch.batch_id,
                            payment_amount: batch.cost,
                            payment_id: response.razorpay_payment_id,
                            enrollment_type: "batch",
                            // payment_status: "successful"
                        };
                        toast.success(`Payment Successful! Enrollment will be updated`);
                        // await enrollUser(enrollmentPayload);
                        navigate("/batches");
                    } catch (enrollErr) {
                        console.error("Enrollment failed after payment:", enrollErr);
                        toast.error("Payment succeeded but enrollment failed.");
                        navigate("/");
                    }
                },
                prefill: {
                    name: student?.name,
                    email: student?.email,
                    contact: student?.phoneNumber,
                },
                theme: {
                    color: "#6C5CE7",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error("Payment initiation failed:", error);
            toast.error("Payment failed. Try again.");
            navigate("/");
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-secondary-gray dark:bg-gray-900 p-6 flex items-center justify-center">
            <div className="max-w-md w-full bg-primary-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                {batch ? (
                    <>
                        <h1 className="text-2xl font-bold text-primary-purple dark:text-primary-white mb-4">
                            Batch Payment
                        </h1>
                        <p className="text-xl font-semibold text-gray-800 dark:text-primary-white">
                            {batch.batch_name}
                        </p>
                        <p className="text-md  text-gray-800 dark:text-primary-white">
                            ₹{batch.cost}
                        </p>
                        <p className="text-md  text-gray-800 dark:text-primary-white">
                            {batch.description}
                        </p>
                        <p className="text-lg font-semibold text-gray-800 dark:text-primary-white">
                            {batch.start_date} - {batch.end_date}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Created on: {new Date(batch.created_at).toLocaleDateString()}
                        </p>
                        <button
                            onClick={handlePayment}
                            className="mt-6 w-full py-2 px-4 bg-primary-purple text-white rounded-lg hover:bg-primary-purple/80 transition-colors"
                        >
                            Pay Now
                        </button>
                    </>
                ) : (
                    <p>Batch details not found.</p>
                )}
            </div>
        </div>
    );
};

export default BatchPayment;
