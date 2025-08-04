import { Flex, Separator, Switch, Text } from '@radix-ui/themes';
import { TbFilterCog } from 'react-icons/tb';
import { useGameStore } from '../../store/gameStore';

export const TasksFilter = () => {
  const onChangeDateFilter = (value: boolean) => {
    useGameStore.getState().setTaskSorting(value);
  };

  const onChangeExpiredFilter = (value: boolean) => {
    console.log(value);
  };

  return (
    <>
      <Flex px="4" width="100%" align="center" gap="4">
        <TbFilterCog color="gray" size="20px" />
        <Separator orientation="vertical" />
        <Text as="label" size="1">
          <Flex gap="2">
            Show newer first
            <Switch
              size="1"
              onCheckedChange={(value) => onChangeDateFilter(value)}
              variant="surface"
            />
          </Flex>
        </Text>
        <Separator orientation="vertical" />
        <Text as="label" size="1">
          <Flex gap="2">
            Show expired (12)
            <Switch
              size="1"
              onCheckedChange={(value) => onChangeExpiredFilter(value)}
              variant="surface"
            />
          </Flex>
        </Text>
        <Separator orientation="vertical" />
      </Flex>
    </>
  );
};
