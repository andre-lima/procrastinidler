import { Flex, Separator, Switch, Text } from '@radix-ui/themes';
import { TbFilterCog } from 'react-icons/tb';
import { useGameStore } from '../../store/gameStore';
import { useTasksStore } from '../../store/tasksStore';
import { TaskState } from '../../types';

export const TasksFilter = () => {
  const { /*newerTasksFirst,*/ showRejectedTasks } = useGameStore(
    (state) => state.filters
  );

  const rejetedTasksLength = useTasksStore(
    (state) =>
      state.getTasksArray().filter((task) => task?.state === TaskState.Rejected)
        .length
  );

  const { unlockedDeadline } = useGameStore((state) => state.gameProgress);

  // const onChangeDateFilter = (value: boolean) => {
  //   useGameStore.getState().setTaskSorting(value);
  // };

  const onChangeExpiredFilter = (value: boolean) => {
    useGameStore.getState().setShowingRejected(value);
  };

  return (
    <Flex px="4" align="center" gap="4">
      {unlockedDeadline && (
        <>
          <TbFilterCog color="gray" size="20px" />
          {/* <Separator orientation="vertical" />
          <Text as="label" size="1">
            <Flex gap="2">
              Show newer first
              <Switch
                checked={newerTasksFirst}
                size="1"
                onCheckedChange={(value) => onChangeDateFilter(value)}
                variant="surface"
              />
            </Flex>
          </Text> */}
          <Separator orientation="vertical" />
          <>
            <Text as="label" size="1">
              <Flex gap="2">
                Show expired ({rejetedTasksLength})
                <Switch
                  checked={showRejectedTasks}
                  size="1"
                  onCheckedChange={(value) => onChangeExpiredFilter(value)}
                  variant="surface"
                />
              </Flex>
            </Text>
            <Separator orientation="vertical" />
          </>
        </>
      )}
    </Flex>
  );
};
