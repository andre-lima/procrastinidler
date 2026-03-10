import { useTasksStore } from '../../store/tasksStore';
import { TaskState } from '../../store/tasksStore';
import { Box, Flex, Heading } from '../shared';
import { humanNumber } from '../../helpers/human-number';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui';

export function CompletedCount() {
  const { t } = useTranslation('common');
  const toSubmitCount = useTasksStore((state) =>
    Object.values(state.tasks).filter((task) => task?.state === TaskState.ToSubmit).length
  );
  const completedCount = useTasksStore((state) =>
    Object.values(state.tasks).filter((task) => task?.state === TaskState.Completed).length
  );
  const submitTasks = useTasksStore((state) => state.submitTasks);

  return (
    <Box
      className="tasksListPanel"
      style={{
        padding: 'var(--space-4)',
        background: 'var(--color-bg-panel)',
      }}
    >
      <Flex direction="column" gap={3}>
        <Heading size="4" as="h2">
          {t('tasks.toSubmit')} ({humanNumber(toSubmitCount)}) · {t('tasks.done')} ({humanNumber(completedCount)})
        </Heading>
        {toSubmitCount > 0 && (
          <Button variant="primary" onClick={submitTasks}>
            {t('tasks.submit')}
          </Button>
        )}
      </Flex>
    </Box>
  );
}
