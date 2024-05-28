import { supabase } from '@/lib/supabase'
import { useCallback, useState } from 'react'

const useTodos = () => {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')

  const handleInputChange = e => {
    console.log(e.target.value)
    setNewTodo(e.target.value)
  }

  // *TODO Fetch Todos
  const fetchTodos = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('Todos')
        .select('*')
        .order('id', { ascending: true })
      setTodos(data)
    } catch (error) {}
  }, [])

  // *TODO Add Todo
  const addTodo = async (todoText: string) => {
    try {
      const { data, error } = await supabase
        .from('Todos')
        .insert([{ todo_text: todoText, is_completed: false }])
      setNewTodo('')

      fetchTodos()
    } catch (error) {
      console.log({})
    }
  }

  // *TODO Update todo
  const updateTodo = async (todoId: number) => {
    try {
      const { data: currentTodoValue, error } = await supabase
        .from('Todos')
        .select('is_completed')
        .eq('id', todoId)
        .single()

      const updatedTodoValue = !currentTodoValue?.is_completed

      const { error: updateError } = await supabase
        .from('Todos')
        .update({ is_completed: updatedTodoValue })
        .eq('id', todoId)
        .select()

      fetchTodos()
    } catch (error) {
      console.log(error)
    }
  }

  // *TODO Delete todo
  const deleteTodo = async (todoId: number) => {
    try {
      const { data, error } = await supabase
        .from('Todos')
        .delete()
        .eq('id', todoId)
      fetchTodos()
    } catch (error) {
      console.log(error)
    }
  }

  return [
    { todos, newTodo },
    { fetchTodos, updateTodo, deleteTodo, handleInputChange, addTodo },
  ]
}

export { useTodos }
