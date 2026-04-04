function Modal({
    isModalOpen,
    closeModal,
    editedUser,
    setEditedUser,
    updateUsers,
    loading,
    errors
}) {

    if (!isModalOpen) return null

    return (

        <div
            className="modal-overlay"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    closeModal()
                }}
            }
        >
            <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
                <h1>Editar Feiticeiro</h1>

                <input
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
                    <button className='btncrud cancel' onClick={() => closeModal()}>Cancelar</button>
                </div>

            </div>
        </div>
    )
}

export default Modal