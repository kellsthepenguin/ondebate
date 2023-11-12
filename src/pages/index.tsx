import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TopBar from '../components/TopBar'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { DebateBox } from '@/components/DebateBox'
import Popup from 'reactjs-popup'
import CreateDebate from '@/components/CreateDebate'

export default function Home() {
  return (
    <div>
      <TopBar />
      <div className='pl-7 pt-3'>
        <div className='flex items-center'>
          <span className='font-semibold text-3xl'>모집중인 토론</span>
          <Popup
            trigger={
              <span className='pl-4 font-semibold text-blue-500'>
                <FontAwesomeIcon icon={faPlus} />
                &nbsp;
                <span>새 토론 만들기</span>
              </span>
            }
            overlayStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            modal
          >
            <CreateDebate />
          </Popup>
        </div>
        <DebateBox type='recruiting' /> <br />
        <span className='font-semibold text-3xl'>진행중인 토론</span>
        <DebateBox type='ongoing' />
      </div>
    </div>
  )
}
