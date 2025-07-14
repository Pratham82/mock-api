import { supabase } from "@/lib/supabase"
import { MouseEventHandler, useCallback, useState } from "react"
import toast from "react-hot-toast"

export type Todo = {
  id: string
  created_at: string
  title: string
  completed: boolean
}

const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")

  // *TODO Fetch Todos
  const fetchTodos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("id", { ascending: true })

      if (error) {
        toast.error("Unable to fetch todos")
      }
      setTodos(data ?? [])
    } catch (error) {}
  }, [])

  // *TODO Add Todo
  const addTodo = async (todoText: string) => {
    try {
      const { error } = await supabase.from("todos").insert([{ title: todoText, completed: false }])

      if (error) {
        toast.error("Unable to add todo")
      }

      setNewTodo("")
      toast.success("Successfully Added todo")
      fetchTodos()
    } catch (error) {
      console.log(error)
    }
  }

  // *TODO Update todo
  const updateTodo = async (todoId: string) => {
    try {
      const { data: currentTodoValue, error } = await supabase
        .from("todos")
        .select("completed")
        .eq("id", todoId)
        .single()

      const updatedTodoValue = !currentTodoValue?.completed

      const { error: updateError } = await supabase
        .from("todos")
        .update({ completed: updatedTodoValue })
        .eq("id", todoId)
        .select()

      if (updateError) {
        toast.error("Unable to update todo")
      }

      fetchTodos()
    } catch (error) {
      console.log(error)
    }
  }

  // *TODO Delete todo
  const deleteTodo = async (todoId: string) => {
    try {
      const { data, error } = await supabase.from("todos").delete().eq("id", todoId)

      if (error) {
        toast.error("Unable to add todo")
      }

      toast.success("Successfully Removed todo", { icon: "🗑️" })
      fetchTodos()
    } catch (error) {
      console.log(error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value)
  }

  const handleAddTodo = () => {
    if (newTodo) {
      addTodo(newTodo)
    }
  }

  const handleUpdateTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTodo(e.target.value)
  }

  const handleDeleteTodo = (e: any) => {
    deleteTodo(e.target.value)
  }

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && e.ctrlKey && newTodo) {
      addTodo(newTodo)
    }
  }
  return [
    { todos, newTodo },
    {
      fetchTodos,
      updateTodo,
      deleteTodo,
      addTodo,
      handleAddTodo,
      handleDeleteTodo,
      handleUpdateTodo,
      handleKeyDown,
      handleInputChange,
    },
  ]
}

export { useTodos }
