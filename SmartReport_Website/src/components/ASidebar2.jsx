import React from 'react'
import 
{BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill,}
 from 'react-icons/bs'
import{ AiOutlineFileDone} from 'react-icons/ai'
import{ BiSolidUser} from 'react-icons/bi'


 function ASidebar({ openSidebarToggle, OpenSidebar }) {
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
            <a href="/AgentDashboard">
              <BsGrid1X2Fill className='icon' /> Dashboard
            </a>
          </li>
          <li className='sidebar-list-item'>
            <a href="/ATaskAssigned">
              <BsFillArchiveFill className='icon' /> Task Assigned
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
  
  export default ASidebar;