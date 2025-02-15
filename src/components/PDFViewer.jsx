import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Button } from '@headlessui/react';
import { CircleX, FileText } from "lucide-react";
import { BiCloset } from 'react-icons/bi';

export default function PdfViewerModal({ studentData }) {
    const [isOpen, setIsOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");

    function openModal(url) {
        setPdfUrl(url);
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
        setPdfUrl("");
    }

    const documents = [
        { name: "10th Marksheet", url: studentData?.userDocs?.pdf10th?.S },
        { name: "12th Marksheet", url: studentData?.userDocs?.pdf12th?.S },
        { name: "Previous Year Scorecard", url: studentData?.userDocs?.previous_year_scorecard_url?.S },
        { name: "Higher Degree Document", url: studentData?.userDocs?.higher_degree_urls?.L?.[0]?.S },
    ];

    return (
        <>
            {documents.map((doc, index) => (
                doc.url && (
                    <div key={index} className="flex items-center p-4  rounded-lg bg-gray-200 dark:bg-gray-700 cursor-pointer transition-transform transform hover:scale-105 ease-in-out " onClick={() => openModal(doc.url)}>
                        <FileText className="w-8 h-8 text-blue-600 mr-3" />
                        <div>
                            <p className="font-medium dark:text-gray-200 text-gray-900">{doc.name}</p>
                            <span className="text-sm dark:text-gray-200 text-gray-500">PDF</span>
                        </div>
                    </div>
                )
            ))}

            <Dialog open={isOpen} as="div" className="relative z-50 focus:outline-none" onClose={closeModal}>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <DialogPanel className="w-full max-w-2xl rounded-xl dark:bg-gray-700 bg-white p-6 backdrop-blur-2xl">
                        <div className=" text-right flex justify-between items-center">
                            <DialogTitle as="h1" className="text-xl font-medium dark:text-gray-200 text-gray-900">PDF Viewer</DialogTitle>
                             <CircleX onClick={closeModal} className='hover:text-gray-300 ' />
                        </div>
                        <iframe src={pdfUrl} className="w-full h-[75vh] mt-4 " title="PDF Document"></iframe>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}
