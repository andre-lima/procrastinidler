import { useTasksStore } from '../../store/tasksStore';
import { TaskState } from '../../store/tasksStore';
import { useGameStore } from '../../store/gameStore';
import { Box, Flex, Heading } from '../shared';
import { humanNumber } from '../../helpers/human-number';
import { useTranslation } from 'react-i18next';
import { Button, WindowContainer } from '../ui';

export function CompletedCount() {
  const { t } = useTranslation('common');
  const uploadWorkCompleted = useGameStore(
    (state) => state.featuresEnabled.uploadWorkCompleted
  );
  const toSubmitCount = useTasksStore((state) =>
    Object.values(state.tasks).filter((task) => task?.state === TaskState.ToSubmit).length
  );
  const completedCount = useTasksStore((state) =>
    Object.values(state.tasks).filter((task) => task?.state === TaskState.Completed).length
  );
  const submitTasks = useTasksStore((state) => state.submitTasks);

  const showSubmitButton = uploadWorkCompleted && toSubmitCount > 0;

  return (
    <WindowContainer
      variant="primary"
      title="Completed"
    >
      <Flex direction="column" gap={3}>
        <Heading size="4" as="h2">
          {showSubmitButton && (
            <>
              {t('tasks.toSubmit')} ({humanNumber(toSubmitCount)})
            </>
          )}
          {t('tasks.done')} ({humanNumber(completedCount)})
        </Heading>
        {showSubmitButton && (
          <Button variant="primary" onClick={submitTasks}>
            {t('tasks.submit')}
          </Button>
        )}
      </Flex>
    </WindowContainer>
  );
}
