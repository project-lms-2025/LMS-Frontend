// {/* <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
//   {/* Profile Header */}
//   <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//     <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
//       <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
//         <img
//           src={studentData.userDocs.profile_picture_url.S}
//           alt="Profile"
//           className="size-[7rem] object-cover rounded-full"
//         />
//       </div>
//       <div className="flex-1">
//         <h1 className="text-2xl font-bold text-gray-900">{studentData.userData.name.S}</h1>
//         <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div className="flex items-center text-gray-600">
//             <BookOpen className="w-5 h-5 mr-2" />
//             <span>Exam registered : {studentData.authData.exam_registered_for.S}</span>
//           </div>
         
//         </div>
//       </div>
//     </div>
//   </div>

//   {/* Navigation Tabs */}
//   <div className="bg-white rounded-lg shadow-lg mb-6">
//     <div className="border-b">
//       <nav className="flex space-x-8 px-6" aria-label="Tabs">
//         {['overview', 'academic', 'documents'].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab
//               ? 'border-blue-500 text-blue-600'
//               : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </nav>
//     </div>
//   </div>

//   {/* Content Sections */}
//   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//     {activeTab === 'overview' && (
//       <>
//         {/* Personal Information */}
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="text-sm text-gray-500">Email Registered</label>
//                 <p className="font-medium">{studentData.userData.email.S}</p>
//               </div>
//               <div>
//                 <label className="text-sm text-gray-500">Date of Birth</label>
//                 <p className="font-medium">{studentData.userData.dob.S}</p>
//               </div>
//               <div>
//                 <label className="text-sm text-gray-500">Gender</label>
//                 <p className="font-medium">{studentData.userData.gender.S}</p> {/* Add Gender if available */}
//               </div>
//               <div>
//                 <label className="text-sm text-gray-500"> Pincode</label>
//                 <p className="font-medium"> {studentData.userData.pincode.S} </p>
//               </div>
//               <div className="md:col-span-2">
//                 <label className="text-sm text-gray-500">Address</label>
//                 <p className="font-medium">{studentData.userData.address.S}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Contact Information */}
//         <div className="bg-white rounded-lg shadow-lg p-6">
//           <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
//           <div className="space-y-4">
//             <div className="flex items-center">
//               <Phone className="w-5 h-5 text-gray-400 mr-3" />
//               <div>
//                 <p className="text-sm text-gray-500">Phone</p>
//                 <p className="font-medium">{studentData.userData.phoneNumber.S}</p> {/* Add Phone if available */}
//               </div>
//             </div>
//             <div className="flex items-center">
//               <Mail className="w-5 h-5 text-gray-400 mr-3" />
//               <div>
//                 <p className="text-sm text-gray-500">Email</p>
//                 <p className="font-medium">{studentData.userData.email.S}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </>
//     )}

//     {activeTab === 'academic' && (
//       <>
//         {/* Academic Statistics */}
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h2 className="text-lg font-semibold mb-4">Academic Statistics</h2>
//             <div className="space-y-4">
//               <div>
//                 <div className="flex justify-between mb-1">
//                   <span className="text-sm font-medium text-gray-700">Previous Year Score</span>
//                   <span className="text-sm font-medium text-gray-700">{studentData.userData.previous_year_score.N}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div
//                     className="bg-green-600 h-2 rounded-full"
//                     style={{ width: `${studentData.userData.previous_year_score.N}%` }}
//                   ></div>
//                 </div>
//               </div>
//               <div>
//                 <div className="flex justify-between mb-1">
//                   <span className="text-sm font-medium text-gray-700">12th Marks</span>
//                   <span className="text-sm font-medium text-gray-700">{studentData.userData.marks12.N}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div
//                     className="bg-blue-600 h-2 rounded-full"
//                     style={{ width: `${studentData.userData.marks12.N}%` }}
//                   ></div>
//                 </div>
//               </div>
//               <div>
//                 <div className="flex justify-between mb-1">
//                   <span className="text-sm font-medium text-gray-700">10th Marks</span>
//                   <span className="text-sm font-medium text-gray-700">{studentData.userData.marks10.N}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div
//                     className="bg-yellow-600 h-2 rounded-full"
//                     style={{ width: `${studentData.userData.marks10.N}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Achievements */}
//         <div className="bg-white rounded-lg shadow-lg p-6">
//           <h2 className="text-lg font-semibold mb-4">Achievements</h2>
//           <ul className="space-y-3">
//             <li className="flex items-start">
//               <Award className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" />
//               <span className="text-sm text-gray-600">Achieved high marks in 12th: {studentData.userData.marks12.N}%</span>
//             </li>
//             {/* Add more achievements if available */}
//           </ul>
//         </div>
//       </>
//     )}

//     {activeTab === 'documents' && (
//       <PdfViewerModal studentData={studentData} />

//     )}

//   </div>
// </div>
//  */}
