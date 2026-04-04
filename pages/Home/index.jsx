import { useEffect, useState, useRef } from 'react'
import './style.css'
import Trash from '../../src/assets/trash.png'
import Pencil from '../../src/assets/pencil.png'
import Toast from '../../components/Toast'
import Modal from '../../components/Modal'
import api from '../../src/services/api'

function Home() {
  const [users, setUsers] = useState([])
  const [editedUser, setEditedUser] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toast, setToast] = useState(null)
  // toast = { message: "", type: "success" | "error" }
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()
  const editInputRef = useRef()
  const firstInputRef = useRef()
  const lastButtonRef = useRef()
  const confirmFirstRef = useRef()
  const confirmLastRef = useRef()

  async function getUsers() {
    const usersFromApi = await api.get('/usuarios')

    setUsers(usersFromApi.data)
  }

  async function createUsers() {
    const newUser = {
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value
    }

    if (!validateUser(newUser)) return

    try {
      await api.post('/usuarios', {
        name: inputName.current.value,
        age: inputAge.current.value,
        email: inputEmail.current.value
      })

      showToast("Usuário cadastrado com sucesso!", "success")
      getUsers()
    } catch (error) {
      showToast("Erro ao cadastrar usuário", "error")
    }

  }

  async function updateUsers(id) {
    if (!validateUser(editedUser)) return

    try {
      setLoading(true)
      await api.put(`/usuarios/${id}`, editedUser)

      showToast("Usuário atualizado com sucesso!", "success")
      closeModal()
      getUsers()

    } catch (error) {
      showToast("Erro ao atualizar usuário", "error")
    } finally {
      setLoading(false)
    }

  }

  async function deleteUsers(id) {
    try {
      await api.delete(`/usuarios/${id}`)

      showToast("Usuário excluido", "success")
      getUsers()
    } catch (error) {
      showToast("Erro ao excluir usuário", "error")
    }
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditedUser({})
    setErrors({})
  }

  function showToast(message, type = "success") {
    setToast({ message, type })

    setTimeout(() => {
      setToast(null)
    }, 3000)
  }

  function validateUser(user) {
    const newErrors = {}

    if (!user.name) newErrors.name = true
    if (!user.age || isNaN(user.age)) newErrors.age = true
    if (!user.email || !user.email.includes("@")) newErrors.email = true

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      showToast("Corrija os campos destacados", "error")
      return false
    }

    return true
  }

  useEffect(() => {
    getUsers()
  }, [])

  useEffect(() => {
  function handleKeyDown(e) {
    if (e.key === "Escape") {
      closeModal()
      setConfirmOpen(false)
    }
  }

  if (isModalOpen || confirmOpen) {
    if (isModalOpen) {
      setTimeout(() => {
        editInputRef.current?.focus()
      }, 100)
    }

    if (confirmOpen) {
      setTimeout(() => {
        confirmFirstRef. current?.focus()
      }, 100)
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)
  } else {
    document.body.style.overflow = "auto"
  }

  return () => {
    document.body.style.overflow = "auto"
    window.removeEventListener("keydown", handleKeyDown)
  }
}, [isModalOpen, confirmOpen])

//////////////////////////


useEffect(() => {
  function handleTab(e) {
    if (e.key !== "Tab") return

    const active = document.activeElement

    let firstRef = null
    let lastRef = null

    // define qual modal está ativo
    if (isModalOpen) {
      firstRef = firstInputRef
      lastRef = lastButtonRef
    } else if (confirmOpen) {
      firstRef = confirmFirstRef
      lastRef = confirmLastRef
    }
      
    if (!firstRef || !lastRef) return

    if (e.shiftKey) {
      // Shift + Tab (voltar)
      if (active === firstRef.current) {
        e.preventDefault()
        lastRef.current.focus()
      }
    } else {
      // Tab normal
      if (active === lastRef.current) {
        e.preventDefault()
        firstRef.current.focus()
      }
    }
  }

  if (isModalOpen || confirmOpen) {
    window.addEventListener("keydown", handleTab)
  }

  return () => {
    window.removeEventListener("keydown", handleTab)
  }
}, [isModalOpen, confirmOpen])


/////////////////////////

  return (

    <div className='container'>
      <form>
        <h1>Cadastro de Usuários</h1>
        <input placeholder='Nome' name='nome' type='text' ref={inputName} />

        <input placeholder='Idade' name='idade' type='text' ref={inputAge} />
        <input placeholder='E-mail' name='email' type='text' ref={inputEmail} />
        <div className='actions'>
          <button type='button' className='btncrud confirm' onClick={createUsers}>Cadastrar</button>
        </div>
      </form>

      {users.map((user) => (
        <div key={user.id} className='card'>
          <div>
            <p>Nome: <span>{user.name}</span></p>
            <p>Idade: <span>{user.age}</span></p>
            <p>Email: <span>{user.email}</span></p>
          </div>
          <div className='actions'>
            <p>
              <button onClick={() => {
                setEditedUser({ ...user })
                setIsModalOpen(true)
              }}>
                <img className='tx1' src={Pencil} />
              </button>
            </p>

            <p>
              <button onClick={() => {
                setUserToDelete(user.id)
                setConfirmOpen(true)
              }}>
                <img className='tx1' src={Trash} />
              </button>
            </p>

          </div>
        </div>
      ))}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h1>Editar Usuário</h1>

        <input
          ref={(el) => {
    editInputRef.current = el;
    firstInputRef.current = el;
  }}
          className={errors.name ? "input-error" : ""}
          value={editedUser.name || ""}
          onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
        />




        <input
          className={errors.age ? "input-error" : ""}
          value={editedUser.age || ""}
          onChange={(e) => setEditedUser({ ...editedUser, age: e.target.value })}
        />

        <input
          className={errors.email ? "input-error" : ""}
          value={editedUser.email || ""}
          onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
        />

        <div className='actions'>
          <button className='btncrud confirm' onClick={() => updateUsers(editedUser.id)} disabled={loading}>{loading ? "Salvando..." : "Salvar"}</button>
          {" "}
          <button ref={lastButtonRef} className='btncrud cancel' onClick={() => closeModal()}>Cancelar</button>
        </div>
      </Modal>
      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <h1>Tem certeza?</h1>
        <p className='confirmEsc'>O usuário será excluido</p>

        <div className="actions">
          <button
            ref={confirmFirstRef}
            className='btncrud confirm'
            onClick={async () => {
              await deleteUsers(userToDelete)
              setConfirmOpen(false)
            }}
            disabled={loading}>{loading ? "Excluindo..." : "Confirmar"}
          </button>
          {" "}
          <button
            ref={confirmLastRef}
            className='btncrud cancel'
            onClick={() => setConfirmOpen(false)}>
            Cancelar
          </button>
        </div>
      </Modal>
      < Toast toast={toast} />
    </div >
  )
}

export default Home