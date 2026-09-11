import type { AppId } from '../../state/store';
import About from './About';
import Projects from './Projects';
import Experience from './Experience';
import Terminal from './Terminal';
import Resume from './Resume';
import Contact from './Contact';
import Navigator from './Navigator';
import VoidRunner from './VoidRunner';
import Trash from './Trash';

export default function AppContent({ id, arg }: { id: AppId; arg?: string }) {
  switch (id) {
    case 'about': return <About />;
    case 'projects': return <Projects initial={arg} />;
    case 'experience': return <Experience />;
    case 'terminal': return <Terminal />;
    case 'resume': return <Resume />;
    case 'contact': return <Contact />;
    case 'navigator': return <Navigator />;
    case 'voidrunner': return <VoidRunner />;
    case 'trash': return <Trash />;
  }
}
