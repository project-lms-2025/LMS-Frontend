import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import { createPaymentOrder, getUserProfile } from '../../api/auth';
import { getTestSeriesById } from '../../api/testSeries';

const BatchPayment = () => {
    const { series_id } = useParams();
    const [testSeries, setTestSeries] = useState(null);
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(series_id)
                const batchRes = await getTestSeriesById(series_id);
                console.log("this is test series response data: ", batchRes.data);
                setTestSeries(batchRes.data);

                const userRes = await getUserProfile();
                setStudent(userRes.data);
            } catch (error) {
                toast.error("Failed to load test series or student data.");
                console.error("Data fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (series_id) {
            fetchData();
        }
    }, [series_id]);

    const handlePayment = async () => {
        try {
            const order = await createPaymentOrder({
                series_id: testSeries.series_id,  // Use testSeries.series_id instead of series_id
                amount: testSeries?.cost,         // Adjust to use the correct property for cost
                currency: "INR",
            });

            const { id: order_id, amount, currency } = order;

            const options = {
                key: import.meta.env.VITE_Test_key_id,
                amount,
                currency,
                name: "TeacherTech",
                description: `Payment for series: ${testSeries?.title || ""}`,  // Update to use testSeries.title
                order_id,
                handler: async function (response) {
                    try {
                        toast.success(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);

                        const enrollmentPayload = {
                            series_id: testSeries.series_id,  // Use testSeries.series_id
                            payment_amount: testSeries.cost,  // Use testSeries.cost
                            payment_id: response.razorpay_payment_id,
                            enrollment_type: "testSeries",
                        };
                        toast.success(`Payment Successful! Enrollment will be updated`);
                        // await enrollUser(enrollmentPayload);
                        navigate("/test-series");  // Adjust the navigate path accordingly
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
                {testSeries ? (
                    <>
                        <h1 className="text-2xl font-bold text-primary-purple dark:text-primary-white mb-4">
                            Test Series Payment
                        </h1>
                        <p className="text-xl font-semibold text-gray-800 dark:text-primary-white">
                            {testSeries.title}
                        </p>
                        <p className="text-md text-gray-800 dark:text-primary-white">
                            ₹{testSeries.cost || 0}
                        </p>
                        <p className="text-md text-gray-800 dark:text-primary-white">
                            {testSeries.description}
                        </p>
                        {/* Update this based on your test series data structure */}
                        <p className="text-lg font-semibold text-gray-800 dark:text-primary-white">
                            {/* You may need to update this if you want a start or end date for the test series */}
                            {/* {testSeries.start_date} - {testSeries.end_date} */}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Created on: {new Date(testSeries.created_at).toLocaleDateString()}
                        </p>
                        <button
                            onClick={handlePayment}
                            className="mt-6 w-full py-2 px-4 bg-primary-purple text-white rounded-lg hover:bg-primary-purple/80 transition-colors"
                        >
                            Pay Now
                        </button>
                    </>
                ) : (
                    <p>Test series details not found.</p>
                )}
            </div>
        </div>
    );
};

export default BatchPayment;
