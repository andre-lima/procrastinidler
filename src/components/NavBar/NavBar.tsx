import { BellIcon } from '@radix-ui/react-icons';
import { Menubar } from 'radix-ui';
import { useGameStore } from '../../store/gameStore';
import type { GameState } from '../../types';
import './styles.scss';

export const NavBar = () => {
  const { newTodo, money } = useGameStore((state: GameState) => state);

  return (
    <div className="navBar">
      <Menubar.Root className="MenubarRoot">
        <Menubar.Menu>
          <Menubar.Trigger onClick={() => newTodo()} className="MenubarTrigger">
            + Todo
          </Menubar.Trigger>
          <Menubar.Trigger onClick={() => newTodo()} className="MenubarTrigger">
            <BellIcon /> Boss
          </Menubar.Trigger>
          <Menubar.Trigger onClick={() => newTodo()} className="MenubarTrigger">
            Assistants
          </Menubar.Trigger>
        </Menubar.Menu>
      </Menubar.Root>
      <div>Not a todo list app</div>
      <div>{money}$</div>
    </div>
  );
};
