export default function HUD({ zoneName }) {
    return (
        <div className="hud">
            <div className="hud-top">
                <h2 className="zone-title">{zoneName}</h2>
            </div>

            <div className="hud-bottom">
                <div className="controls-hint">
                    WASD : Déplacer • Clic Droit + Drag : Caméra • Espace : Sauter • R : Reset
                </div>
            </div>
        </div>
    )
}
