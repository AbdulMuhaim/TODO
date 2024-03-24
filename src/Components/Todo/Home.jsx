import logo from "../../../public/Screenshot 2024-03-22 174558.png";
import { Button } from "antd";
import { MdDelete } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";
import { db } from "../../firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import illustration from "../../../public/9318688-removebg-preview.png";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

function Home() {
  const [todos, setTodos] = useState([]);
  const todoLists = collection(db, "Todos");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [update, setUpdate] = useState(false);
  const [searchValue, setsearchValue] = useState("");
  const [filteredData, setfilteredData] = useState([]);
  const userId = localStorage.getItem("email");

  const getData = async () => {
    try {
      if (!userId) {
        throw new Error("User not found");
      }

      const q = query(todoLists, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const sortedTodos = querySnapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .filter((todo) => todo.user === userId);

      setTodos(sortedTodos);
      setfilteredData(sortedTodos);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [update]);

  const createTodo = async () => {
    await addDoc(todoLists, {
      title: title,
      description: description,
      status: true,
      favourite: false,
      user: userId,
      createdAt: serverTimestamp(),
    });
    setUpdate(!update);
    setTitle("");
    setDescription("");
  };

  const ChangeTodoStatus = async (id) => {
    const updateVal = doc(db, "Todos", id);
    await updateDoc(updateVal, { status: false });
    setUpdate(!update);
  };

  const deleteTodo = async (id) => {
    const deleteVal = doc(db, "Todos", id);
    await deleteDoc(deleteVal);
    setUpdate(!update);
  };

  const addtoFavourite = async (id) => {
    const updateVal = doc(db, "Todos", id);
    await updateDoc(updateVal, { favourite: true });
    setUpdate(!update);
  };

  const filteredTodos = (value) => {
    if (value === "completed") {
      setfilteredData(todos.filter((todo) => !todo.status));
    } else if (value === "favourites") {
      setfilteredData(todos.filter((todo) => todo.favourite && todo.status));
    } else {
      setfilteredData(todos);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      <div className="p-10 flex gap-5 h-[100vh] flex-wrap">
        <div className="w-[50vw] flex justify-center items-center flex-col">
          <div className="fixed top-10 left-10 md:w-[4vw] md:h-[4vh] w-[7vw] h-[7vh]">
            <img src={logo} alt="no img" />
          </div>
          <div className="fixed right-12 top-6">
            <Button onClick={handleLogout} className="opacity-85">
              Logout
            </Button>
          </div>

          <div>
            <h1 className="text-4xl pl-52 md:pl-0 font-bold font-sans text-black">Todo</h1>
          </div>
          <div className="md:w-[35vw] w-[70vw] pt-7">
            <p className="text-lg pl-52 md:pl-0 font-medium opacity-65 hover:opacity-50">
              "Every journey begins with a single task. Embrace the process, and
              soon your 'to-do' will become 'done'."
            </p>
          </div>

          <div className="pt-20 pl-52 md:pl-0">
            <div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Title"
                className="border border-gray-300 rounded-md py-2  md:w-[15vw] w-[50vw] h-[7vh] px-4 hover:border-black focus:outline-none focus:border-blue-400 mb-5 shadow-md"
              />
            </div>
            <div>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                placeholder="Description"
                className="border border-gray-300 rounded-md py-2 md:w-[15vw] w-[50vw] h-[7vh] px-4  hover:border-black focus:outline-none focus:border-blue-400 shadow-md"
              />
            </div>
            <div>
              <Button
                onClick={createTodo}
                className="md:w-[15vw] w-[50vw] h-[7vh] bg-blue-600 rounded-2xl border mt-5 text-white flex justify-center items-center text-lg"
                style={{
                  backgroundColor: "#1890ff",
                  borderColor: "#1890ff",
                  color: "#fff",
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        <div className="w-[50vw] mx-auto md:mt-10 p-4 mt-2 mb-2 bg-gradient-to-tr from-green-400 to-blue-400 shadow-2xl border rounded-xl md:mb-10 overflow-auto">
          <div className="flex flex-col">
            <h2 className="text-2xl font-sans font-bold mt-4 flex justify-center items-center">
              Todo List
            </h2>
            <h1 className="mb-5 font-medium opacity-60 text-sm flex justify-center items-center">
              Stay Organized
            </h1>
          </div>

          <div className="flex justify-between gap-3">
            <div>
              <input
                onChange={(e) => setsearchValue(e.target.value)}
                type="text"
                placeholder="Search..."
                className="border border-gray-300 rounded-md w-[25vw] py-2 px-4 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div className="relative">
              <select
                onChange={(e) => filteredTodos(e.target.value)}
                className="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow"
              >
                <option value="">All</option>
                <option value="completed">Completed</option>
                <option value="favourites">Favorites</option>
              </select>
            </div>
          </div>
          <br />
          <br />

          <ul className="mt-4">
            {filteredData.length > 0 ? (
              filteredData
                .filter((todo) => {
                  return searchValue.toLocaleLowerCase() === ""
                    ? todo
                    : todo.title.toLocaleLowerCase().includes(searchValue);
                })
                .map((todo) => (
                  <li
                    key={todo.id}
                    className="flex flex-col md:flex-row justify-between items-center border-b border-gray-300 py-2"
                  >
                    <span
                      className={`overflow-y-auto h-20 w-[30vw] font-semibold text-xl ${
                        todo.status === false ? "line-through opacity-20" : ""
                      }`}
                    >
                      {todo.title}
                      <br />
                      <span className="text-base font-medium">
                        {todo.description}
                      </span>
                    </span>
                    <div className="flex">
                      <button
                        className={`text-black text-2xl font-bold pr-5 ${
                          todo.status === false ? "hidden" : ""
                        }`}
                        title="Complete"
                        onClick={() => ChangeTodoStatus(todo.id)}
                      >
                        <IoMdDoneAll />
                      </button>
                      <button
                        className={`text-2xl text-gray-600 font-bold pr-5 ${
                          !todo.status ? "hidden" : ""
                        }`}
                        title="Favourite"
                        onClick={() => addtoFavourite(todo.id)}
                      >
                        {todo.favourite ? <FaHeart /> : <FiHeart />}
                      </button>
                      <button
                        className="text-red-500 text-2xl font-bold"
                        title="Delete"
                        onClick={() => deleteTodo(todo.id)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </li>
                ))
            ) : (
              <div className="absolute top-52 right-60">
                <img
                  src={illustration}
                  alt="no img"
                  className="w-[27vw] h-[55vh] pl-20"
                />
                <p className="absolute right-4 bottom-8 whitespace-nowrap opacity-70">
                  Oops! It looks like there are no todos to show.
                </p>
              </div>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Home;
