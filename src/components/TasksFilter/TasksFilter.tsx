import { Box, Flex, Switch, Text } from '@radix-ui/themes';

export const TasksFilter = () => {
  const onChangeDateFilter = (value: boolean) => {
    console.log(value);
  };

  return (
    <Flex p="4" width="100%">
      <Box>
        <Text>Newer First</Text>
        <Switch
          onCheckedChange={(value) => onChangeDateFilter(value)}
          variant="surface"
          defaultChecked
        />
        <Text>Older First</Text>
      </Box>
    </Flex>
  );
};
