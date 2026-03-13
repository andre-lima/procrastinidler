import { Button } from '../ui';
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
import { RamDisplay } from '../RamDisplay/RamDisplay';
import { Meters } from '../Meters/Meters';
import { useUpgradesStore } from '../../store/upgradesStore';
import { useGameStore } from '../../store/gameStore';

export const NavBar = () => {
  const assistants = useAssistantStore((state) => state.assistants);
  const boss = useBossStore((state) => state.boss);
  const { t } = useTranslation('common');
  const runNumber = useGameStore((state) => state.runNumber ?? 1);

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
    <>
      <div className="gameHeaderNav" style={{ padding: 'var(--space-3) var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <Button variant="primary" onClick={createNewTask}>
          {t('menus.addTask')}
        </Button>

        <Button
          variant="secondary"
          onClick={() => useGameStore.getState().startNewRun()}
        >
          {t('menus.newRun')}
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

        <NavDialogButton id="computer">
          <PurchaseUpgrades id="computer" />
        </NavDialogButton>

        {Object.values(assistants).map(
          (assistant) =>
            assistant && <Assistant key={assistant.id} id={assistant.id} />
        )}

        {boss && <Boss />}
      </div>

      <div className="gameHeaderCurrency" style={{ padding: 'var(--space-4) var(--space-3)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-4)' }}>
        <span style={{ color: 'var(--color-fg-dim)', fontFamily: 'var(--font-mono)' }}>
          {t('jobLabel', { number: runNumber })}
        </span>
        <RamDisplay />
        <MoneyDisplay />
      </div>
    </>
  );
};
