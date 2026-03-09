import { useTasksStore } from '../../store/tasksStore';
import { TaskState } from '../../store/tasksStore';
import { Box, Heading } from '../shared';
import { humanNumber } from '../../helpers/human-number';

export function CompletedCount() {
  const count = useTasksStore((state) =>
    Object.values(state.tasks).filter((t) => t?.state === TaskState.Completed).length
  );

  return (
    <Box
      className="tasksListPanel"
      style={{
        padding: 'var(--space-4)',
        background: 'var(--color-bg-panel)',
      }}
    >
      <Heading size="4" as="h2">
        Completed ({humanNumber(count)})
      </Heading>
    </Box>
  );
}
