import { Task } from "../modal";
import { GiCheckMark } from "react-icons/gi";
import { GoDash } from "react-icons/go";
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import styles from "./Task.module.css";

interface uncheckedtasksProps {
  uncheckedTasks: Task[];
  editingId: number | null;
  newTask: string;
  handleSave: () => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
  handleCheck: (id: number) => void;
  setNewTask: React.Dispatch<React.SetStateAction<string>>;
}
function UncheckedTaskList({
  uncheckedTasks,
  editingId,
  newTask,
  handleCheck,
  handleDelete,
  handleEdit,
  handleSave,
  setNewTask,
}: uncheckedtasksProps) {
  return (
        <div className={styles.column}>
          {uncheckedTasks.map((t, index) => (
                <div
                key={index}
                  className={styles.task}
                >
                  <div>
                    {editingId === t.id ? (
                      <>
                        <input
                          type="text"
                          className={`${styles.task__input}`}
                          value={newTask}
                          onChange={(e) => setNewTask(e.target.value)}
                        />
                        <button
                          className={`${styles.task__savebtn}`}
                          onClick={handleSave}
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <h3>{t.task}</h3>
                        <div>
                          <button
                            className={`${styles.task__btn}`}
                            onClick={() => handleEdit(t.id)}
                          >
                            <CiEdit color="yellow" />
                          </button>
                          <button
                            className={`${styles.task__btn}`}
                            onClick={() => handleDelete(t.id)}
                          >
                            <MdDeleteForever color="red" />
                          </button>
                          <button
                            className={`${styles.task__btn}`}
                            onClick={() => handleCheck(t.id)}
                          >
                            {t.isDone ? (
                              <GiCheckMark color="green" />
                            ) : (
                              <GoDash />
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
          ))}
        </div>
  );
}
export default UncheckedTaskList;