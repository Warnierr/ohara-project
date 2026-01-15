import { useGameStore } from '../../stores/useGameStore'

export default function DialogBox({ dialog }) {
    const closeDialog = useGameStore((state) => state.closeDialog)

    return (
        <div className="dialog-box">
            <div className="dialog-speaker">{dialog.speaker}</div>
            {dialog.title && <h3 style={{ color: '#7ec8a8', marginBottom: '8px' }}>{dialog.title}</h3>}
            <div className="dialog-content">{dialog.content}</div>
            <button className="dialog-close" onClick={closeDialog}>
                Continuer
            </button>
        </div>
    )
}
