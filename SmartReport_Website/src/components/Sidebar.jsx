import React from 'react'
import 
{BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill,}
 from 'react-icons/bs'
import{ AiOutlineFileDone} from 'react-icons/ai'
import{ BiSolidUser} from 'react-icons/bi'

 function Sidebar({ openSidebarToggle, OpenSidebar }) {
    return (
      <aside id="sidebar" className={openSidebarToggle ? 'sidebar-responsive' : ''}>
        <div className='sidebar-title'>
          <div className='sidebar-brand'>
            Smart Report
          </div>
          <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>
  
        <ul className='sidebar-list'>
          <li className='sidebar-list-item'>
            <a href="/ManagerDashboard">
              <BsGrid1X2Fill className='icon' /> Dashboard
            </a>
          </li>
          <li className='sidebar-list-item'>
            <a href="/ReportManagement">
              <BsFillArchiveFill className='icon' /> Report Management
            </a>
          </li>
          <li className='sidebar-list-item'>
            <a href="/ReportTracking">
              <BsMenuButtonWideFill className='icon' /> Report Tracking 
            </a>
          </li>
          <li className='sidebar-list-item'>
            <a href="/CompletedReport">
              <AiOutlineFileDone className='icon' /> Completed Report 
            </a>
          </li>
          <li className='sidebar-list-item'>
            <a href="/FeedbackRating">
              <AiOutlineFileDone className='icon' /> Feeback/Rating Review
            </a>
          </li>
          <li className='sidebar-list-item'>
            <a href="/Profile">
              <BiSolidUser className='icon' /> Profile
            </a>
          </li>
          
          <li className='sidebar-list-item'>
            <a href="/Setting">
              <BsFillGearFill className='icon' /> Setting
            </a>
          </li>
        </ul>
      </aside>
    );
  }
  
  export default Sidebar;