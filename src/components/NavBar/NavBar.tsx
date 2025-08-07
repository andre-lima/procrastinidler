import { useGameStore } from '../../store/gameStore';
import { Button, Flex, Grid } from '@radix-ui/themes';
import { LuPlus } from 'react-icons/lu';
import { TaskState } from '../../types';
import { useTasksStore } from '../../store/tasksStore';
import { Assistant } from '../Assistant/Assistant';
import { useAssistantStore } from '../../store/assistantStore';
import { PurchaseUpgrades } from '../PurchaseUpgrades/PurchaseUpgrades';
import { NavDialogButton } from './NavDialogButton';
import { useBossStore } from '../../store/bossStore';
import { Boss } from '../Boss/Boss';
import { useTranslation } from 'react-i18next';
import { MoneyDisplay } from '../MoneyDisplay/MoneyDisplay';

export const NavBar = () => {
  const money = useGameStore((state) => state.money);
  const assistants = useAssistantStore((state) => state.assistants);
  const boss = useBossStore((state) => state.boss);
  const { t } = useTranslation('common');

  const createNewTask = () => {
    const newTaskTodo = useTasksStore.getState().tasks.clickNewTask;
    if (newTaskTodo && newTaskTodo.state === TaskState.Todo) {
      useTasksStore.getState().completeTask(newTaskTodo.id);
    }

    useTasksStore.getState().newTask();
  };

  return (
    <Flex px="4" py="3" width="100%" height={'70px'}>
      <Grid columns="1fr auto" gap="3" rows="1" width="100%" align="center">
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
            <LuPlus /> {t('menus.addTask')}
          </Button>

          <NavDialogButton id="personal">
            <PurchaseUpgrades id="personal" />
          </NavDialogButton>

          <NavDialogButton id="boss">
            <PurchaseUpgrades id="boss" />
          </NavDialogButton>

          <NavDialogButton id="assistants">
            <PurchaseUpgrades id="assistants" />
          </NavDialogButton>

          {Object.values(assistants).map(
            (assistant) =>
              assistant && <Assistant key={assistant.id} id={assistant.id} />
          )}

          {boss && <Boss />}
        </Flex>
        <Flex justify="end" align="center" width="auto">
          <MoneyDisplay money={money} />
        </Flex>
      </Grid>
    </Flex>
  );
};
