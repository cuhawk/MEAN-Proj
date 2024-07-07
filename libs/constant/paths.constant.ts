import { Path } from "../abstract";
import { HomeComponent } from "../home/src";
import { CreateChatComponent, JoinChatComponent } from "../chat-room/src";
import { ChatRoom } from "../abstract/class/ChatRoom";

const PATHS: Array<Path> = [
  {
    id: 1,
    path: '',
    title: 'Home',
    isHeader: true,
    component: HomeComponent
  },
  {
    id: 2,
    path: 'create',
    title: 'Create Online Chat',
    isHeader: true,
    component: CreateChatComponent,
  },
  {
    id: 3,
    path: 'join/:uuid',
    title: 'Join Online Chat',
    isHeader: false,
    component: JoinChatComponent,
    data: new ChatRoom(0, '', '' ),
  },
  {
    id: 4,
    path: '**',
    title: 'Page Not Found',
    isHeader: false,
    component: HomeComponent,
    data: { error: 'Page not found' }
  }
];

export default PATHS;
