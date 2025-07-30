import '@radix-ui/themes/styles.css';
import './App.scss';
import { Grid, Theme } from '@radix-ui/themes';
import { NavBar } from './components/NavBar/NavBar';
import { TaskState, type TasksState } from './types';
import { TasksList } from './components/TasksList/TasksList';
import { PurchaseUpgrades } from './components/PurchaseUpgrades/PurchaseUpgrades';

function App() {
  return (
    <Theme>
      <NavBar />

      <Grid columns="3" gap="4" p="4" width="auto">
        <TasksList
          title="To Do"
          tasksSelector={(state: TasksState) =>
            Object.values(state.tasks)
              .filter((task) => task?.state === TaskState.Todo)
              .map((task) => task?.id || '')
          }
        />
        <TasksList
          title="Completed"
          tasksSelector={(state: TasksState) =>
            Object.values(state.tasks)
              .filter((task) => task?.state === TaskState.Completed)
              .map((task) => task?.id || '')
          }
        />
      </Grid>

      <PurchaseUpgrades />
    </Theme>
  );
}

export default App;
