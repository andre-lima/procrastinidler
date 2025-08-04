import { Flex, Separator, Switch, Text } from '@radix-ui/themes';
import { TbFilterCog } from 'react-icons/tb';

export const TasksFilter = () => {
  const onChangeDateFilter = (value: boolean) => {
    console.log(value);
  };

  const onChangeExpiredFilter = (value: boolean) => {
    console.log(value);
  };

  return (
    <>
      <Flex px="4" width="100%" align="center" gap="6">
        <TbFilterCog size="24px" />
        <Separator orientation="vertical" />
        <Text as="label" size="2">
          <Flex gap="2">
            Show newer first
            <Switch
              onCheckedChange={(value) => onChangeDateFilter(value)}
              variant="surface"
            />
          </Flex>
        </Text>
        <Separator orientation="vertical" />
        <Text as="label" size="2">
          <Flex gap="2">
            Show expired (12)
            <Switch
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
