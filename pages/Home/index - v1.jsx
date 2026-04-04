import { useEffect, useState, useRef } from 'react'
import './style.css'
import Trash from '../../src/assets/trash.png'
import Pencil from '../../src/assets/pencil.png'
import Confirm from '../../src/assets/confirm.png'
import Cancel from '../../src/assets/cancel.png'
import api from '../../src/services/api'

function Home() {
  const [users, setUsers] = useState([])
  const [editingUserId, setEditingUserId] = useState(null)
  const [editedUser, setEditedUser] = useState({})

  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()

  async function getUsers() {
    const usersFromApi = await api.get('/usuarios')

    setUsers(usersFromApi.data)
  }

  async function createUsers() {

    await api.post('/usuarios', {
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value
    })

    getUsers()
  }

  async function updateUsers(id) {
    await api.put(`/usuarios/${id}`, editedUser)

    setEditingUserId(null)
    setEditedUser({})
    getUsers()
  }

  async function deleteUsers(id) {
    await api.delete(`/usuarios/${id}`)

    getUsers()
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (

    <div className='container'>
      <form>
        <h1>Cadastro de Feiticeiros Jujutsu</h1>
        <input placeholder='Nome' name='nome' type='text' ref={inputName} />
        <input placeholder='Idade' name='idade' type='text' ref={inputAge} />
        <input placeholder='E-mail' name='email' type='text' ref={inputEmail} />
        <button type='button' onClick={createUsers}>Cadastrar</button>
      </form>

      {users.map((user) => (
        <div key={user.id} className='card'>
          <div>
            <p>
              Nome: {" "}
              {editingUserId === user.id ? (
                <input
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                />
              ) : (
                <span>{user.name}</span>
              )}
            </p>
            <p>
              Idade: {" "}
              {editingUserId === user.id ? (
                <input
                  value={editedUser.age}
                  onChange={(e) => setEditedUser({ ...editedUser, age: e.target.value })}
                />
              ) : (
                <span>{user.age}</span>
              )}
            </p>
            <p>
              Email: {" "}
              {editingUserId === user.id ? (
                <input
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                />
              ) : (
                <span>{user.email}</span>
              )}
            </p>
          </div>
          <div className='actions'>
            {editingUserId !== user.id && (
              <p>
                <button onClick={() => {
                  setEditingUserId(user.id)
                  setEditedUser(user)
                }}>
                  <img className='tx1' src={Pencil} />
                </button>
              </p>
            )}

            {editingUserId !== user.id && (
              <p>
                <button onClick={() => deleteUsers(user.id)}>
                  <img className='tx1' src={Trash} />
                </button>
              </p>
            )}

            {editingUserId === user.id && (
              <p>
                <button onClick={() => updateUsers(user.id)}>
                  <img className='tx1' src={Confirm} />
                </button>
              </p>
            )}

            {editingUserId === user.id && (
              <p>
                <button onClick={() => setEditingUserId(null)}>
                  <img className='tx1' src={Cancel} />
                </button>
              </p>

            )}

          </div>
        </div>
      ))}
    </div>
  )
}

export default Home
