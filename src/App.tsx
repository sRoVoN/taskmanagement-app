import { useState, useEffect } from "react";
import { Task } from "./modal";
import TaskInput from "./components/TaskInput";
import styles from "./components/Tasklist.module.css";
import CheckedTasksList from "./components/CheckedTasksList";
import UncheckedTaskList from "./components/UncheckedTaskList";
import { DragDropContext, Droppable, DropResult , Draggable} from "react-beautiful-dnd";
import { Todo } from "./todomodul";

function App() {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTask, setNewTask] = useState<string>("");
  const [checkedTasks, setCheckedTasks] = useState<Task[]>([]);
  const [uncheckedTasks, setUncheckedTasks] = useState<Task[]>([]);
  const [todos, setTodos] = useState <Todo[]>([
    { id: "1", title: "do homework" },
    { id: "2", title: "load dishwasher" },
    { id: "3", title: "make your bed" },
  ]);

  const [checkedTodos, setCheckedTodos] = useState<Todo[]>([
    { id: "4", title: "do housework" },
    { id: "5", title: "do laundry" },
    { id: "6", title: "set the table" },
  ]);
  useEffect(() => {
    const data = localStorage.getItem("tasks");
    if (data !== null) setTasks(JSON.parse(data));
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    const updateCheckedTasks = tasks.filter((task) => task.isDone);
    setCheckedTasks(updateCheckedTasks);
    const updateUncheckedTasks = tasks.filter((task) => !task.isDone);
    setUncheckedTasks(updateUncheckedTasks);
  }, [tasks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      setTasks((prev) => [
        ...prev,
        {
          id: Date.now(),
          task: task,
          isDone: false,
        },
      ]);
      setTask(""); 
    } else {
      alert("Please add a task");
    }
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  const handleDelete = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleSave = () => {
    if (newTask)
      setTasks((prevTasks) =>
        prevTasks.map((preTask) =>
          preTask.id === editingId ? { ...preTask, task: newTask } : preTask
        )
      );
    setEditingId(null);
    setNewTask("");
  };

  const handleCheck = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((prevTask) =>
        prevTask.id === id
          ? { ...prevTask, isDone: !prevTask.isDone }
          : prevTask
      )
    );
  };
 
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
  
    if (!destination) return; // if no destination, return early
  
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return; // if dropped in the same place, do nothing
    }
  
    let movedItem;
  
  
    if (source.droppableId === "unchecked") {
      movedItem = todos[source.index];
      const newTodos = Array.from(todos);
      newTodos.splice(source.index, 1); 
      setTodos(newTodos); 
    } else {
      movedItem = checkedTodos[source.index]; 
      const newCheckedTodos = Array.from(checkedTodos);
      newCheckedTodos.splice(source.index, 1); 
      setCheckedTodos(newCheckedTodos); 
    }
    if (destination.droppableId === "unchecked") {
      setTodos((prevTasks) => [...prevTasks, movedItem]);
    } else {
      setCheckedTodos((prevCheckedTasks) => [...prevCheckedTasks, movedItem]);
    }
  };
  


  return (
    <>
      <TaskInput task={task} setTask={setTask} handleSubmit={handleSubmit} />
        <div className={styles.tasklist}>
          <div className={styles.column}>
            <h2>Unchecked Tasks</h2>
            <UncheckedTaskList
              uncheckedTasks={uncheckedTasks}
              editingId={editingId}
              newTask={newTask}
              setNewTask={setNewTask}
              handleCheck={handleCheck}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              handleSave={handleSave}
            />
          </div>
              <div
                className={styles.column}
              >
                <h2>Checked Tasks</h2>
                <CheckedTasksList
                  checkedTasks={checkedTasks}
                  setCheckedTasks={setCheckedTasks}
                  editingId={editingId}
                  newTask={newTask}
                  setNewTask={setNewTask}
                  handleCheck={handleCheck}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                  handleSave={handleSave}
                />
        </div>
        </div>
           <div className="app">
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="box">
                  <Droppable
                    droppableId="unchecked"
                    isDropDisabled={false}
                    isCombineEnabled={false}
                    ignoreContainerClipping={false}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="column"
                      >
                        <h3>Unchecked</h3>
                        <div className="container">
                        {todos.map((todo, index) => (
                          <Draggable
                            index={index}
                            key={todo.id} 
                            draggableId={todo.id.toString()} 
                          >
                            {(provided) => (
                              <div
                                className="task"
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                              >
                                {todo.title}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>        
                  <Droppable
                    droppableId="checked"
                    isDropDisabled={false}
                    isCombineEnabled={false}
                    ignoreContainerClipping={false}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="column"
                      >
                        <h3>Checked</h3>
                        <div className="container">
                        {checkedTodos.map((todo, index) => (
                          <Draggable
                          key={todo.id} 
                          draggableId={todo.id.toString()} 
                            index={index}
                          >
                            {(provided) => (
                              <div
                                className="task"
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                              >
                                {todo.title}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </DragDropContext>
            </div>
    </>
  );
}

export default App;
