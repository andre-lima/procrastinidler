import { useGameStore } from '../../store/gameStore';
import { Badge, Button, Dialog, Flex, Grid, Heading } from '@radix-ui/themes';
import { LuCoins, LuCrown, LuPlus } from 'react-icons/lu';
import { TaskState, type UpgradesState } from '../../types';
import { useTasksStore } from '../../store/tasksStore';
import { Assistant } from '../Assistant/Assistant';
import { useAssistantStore } from '../../store/assistantStore';
import { PurchaseUpgrades } from '../PurchaseUpgrades/PurchaseUpgrades';
import { useShallow } from 'zustand/shallow';
import { NavDialogButton } from './NavDialogButton';
import { useBossStore } from '../../store/bossStore';
import { Boss } from '../Boss/Boss';

export const NavBar = () => {
  const money = useGameStore((state) => state.money);
  const assistants = useAssistantStore((state) => state.assistants);
  const boss = useBossStore((state) => state.boss);

  const createNewTask = () => {
    const newTaskTodo = useTasksStore.getState().tasks.clickNewTask;
    if (newTaskTodo && newTaskTodo.state === TaskState.Todo) {
      useTasksStore.getState().completeTask(newTaskTodo.id);
    }

    useTasksStore.getState().newTask();
  };

  return (
    <div className="navBar">
      <Flex p="4" maxWidth="100%" height={'80px'}>
        <Grid columns="3" gap="3" rows="1" width="100%" align="center">
          <Flex gap="2" align="center">
            <Button
              style={{
                backgroundColor: 'var(--gray-12)',
                color: 'var(--gray-1)',
              }}
              variant="surface"
              size="3"
              onClick={createNewTask}
            >
              <LuPlus /> Task
            </Button>

            <Dialog.Root>
              <Dialog.Trigger>
                <Button
                  style={{
                    backgroundColor: 'var(--gray-1)',
                    color: 'var(--gray-12)',
                  }}
                  variant="surface"
                >
                  <LuCrown /> Boss
                </Button>
              </Dialog.Trigger>
            </Dialog.Root>

            <NavDialogButton id="assistants">
              <PurchaseUpgrades
                upgradesSelector={useShallow((state: UpgradesState) =>
                  Object.values(state.upgrades)
                )}
              />
            </NavDialogButton>

            {Object.values(assistants).map(
              (assistant) =>
                assistant && <Assistant key={assistant.id} id={assistant.id} />
            )}

            {boss && <Boss />}
          </Flex>
          <Flex align="center" justify="center" width="auto">
            <Heading size="4" as="h1">
              Not a task list app!
            </Heading>
          </Flex>
          <Flex justify="end" align="center" width="auto">
            <Badge style={{ fontSize: '1.2em' }} color="yellow" size="3">
              <LuCoins /> {money}$
            </Badge>
          </Flex>
        </Grid>
      </Flex>
    </div>
  );
};
