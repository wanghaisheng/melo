// import React from 'react';
// import { Building2, Users, MessageSquare, Settings, HelpCircle, Plus, Home } from 'lucide-react';
// import { 
//   Sidebar,
//   SidebarContent,
//   SidebarSection,
//   SidebarItem,
//   SidebarSub
// } from '@melo/ui/ui/sidebar';

// // Sample data structure - replace with your actual data
// const sampleOrgs = [
//   {
//     id: '1',
//     name: 'Acme Corp',
//     rooms: [
//       { id: '1', name: 'General', active: true },
//       { id: '2', name: 'Engineering', active: false },
//       { id: '3', name: 'Water Cooler', active: false }
//     ]
//   },
//   {
//     id: '2',
//     name: 'Startup Inc',
//     rooms: [
//       { id: '4', name: 'Team Space', active: false },
//       { id: '5', name: 'Coffee Chat', active: false }
//     ]
//   }
// ];

// export default function DashboardSidebar() {
//   return (
//     <SidebarContent>
//       {/* Home Section */}
//       <SidebarSection>
//         <SidebarItem icon={<Home />}>
//           Home
//         </SidebarItem>
//       </SidebarSection>

//       {/* Organizations Section */}
//       <SidebarSection
//         title="Organizations"
//         titleRightElement={
//           <button className="p-1 hover:bg-secondary rounded-md">
//             <Plus className="h-4 w-4" />
//           </button>
//         }
//       >
//         {sampleOrgs.map(org => (
//           <SidebarSub 
//             key={org.id} 
//             icon={<Building2 className="h-4 w-4" />}
//             title={org.name}
//           >
//             {org.rooms.map(room => (
//               <SidebarItem 
//                 key={room.id} 
//                 icon={<Users className="h-4 w-4" />}
//                 active={room.active}
//               >
//                 {room.name}
//               </SidebarItem>
//             ))}
//             <SidebarItem 
//               icon={<Plus className="h-4 w-4" />}
//               className="text-muted-foreground"
//             >
//               New Room
//             </SidebarItem>
//           </SidebarSub>
//         ))}
//       </SidebarSection>

//       {/* Communication Section */}
//       <SidebarSection title="Communication">
//         <SidebarItem icon={<MessageSquare className="h-4 w-4" />}>
//           Direct Messages
//         </SidebarItem>
//       </SidebarSection>

//       {/* Help & Support Section */}
//       <SidebarSection title="Help & Support">
//         <SidebarItem icon={<HelpCircle className="h-4 w-4" />}>
//           Help Center
//         </SidebarItem>
//         <SidebarItem icon={<MessageSquare className="h-4 w-4" />}>
//           Contact Support
//         </SidebarItem>
//       </SidebarSection>

//       {/* Settings Section */}
//       <SidebarSection>
//         <SidebarItem icon={<Settings className="h-4 w-4" />}>
//           Settings
//         </SidebarItem>
//       </SidebarSection>
//     </SidebarContent>
//   );
// }