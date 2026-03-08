import { Flex, Grid } from '../shared';
import { TaskState } from '../../store/tasksStore';
import { useTasksStore } from '../../store/tasksStore';
import { Assistant } from '../Assistant/Assistant';
import { useAssistantStore } from '../../store/assistantStore';
import { PurchaseUpgrades } from '../PurchaseUpgrades/PurchaseUpgrades';
import { NavDialogButton } from './NavDialogButton';
import { useBossStore } from '../../store/bossStore';
import { Boss } from '../Boss/Boss';
import { useTranslation } from 'react-i18next';
import { MoneyDisplay } from '../MoneyDisplay/MoneyDisplay';
import { useUpgradesStore } from '../../store/upgradesStore';

export const NavBar = () => {
  const assistants = useAssistantStore((state) => state.assistants);
  const boss = useBossStore((state) => state.boss);
  const { t } = useTranslation('common');

  const createNewTask = () => {
    const newTaskTodo = useTasksStore.getState().tasks.clickNewTask;
    if (newTaskTodo && newTaskTodo.state === TaskState.Todo) {
      useTasksStore.getState().completeTask(newTaskTodo.id);
    }

    const numOfTasksToCreate =
      useUpgradesStore.getState().upgrades.personalTasksCreation.currentValue;

    for (let i = 0; i < numOfTasksToCreate; i++) {
      useTasksStore.getState().newTask();
    }
  };

  return (
    <Flex style={{ padding: 'var(--space-4) var(--space-3)', height: '70px' }}>
      <Grid columns="1fr auto" gap={3} rows="1" style={{ width: '100%' }} align="center">
        <Flex gap={2} align="center">
          <button
            type="button"
            className="btn btnPrimary"
            onClick={createNewTask}
          >
            {t('menus.addTask')}
          </button>

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
        <Flex justify="end" align="center">
          <MoneyDisplay />
        </Flex>
      </Grid>
    </Flex>
  );
};
