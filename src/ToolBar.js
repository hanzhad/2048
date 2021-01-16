import React from "react";
import {toolbarHeight} from "./config";

function ToolBar({goBack}) {
    return (
        <div
            style={{
                width: '100%',
                position: 'fixed',
                height: toolbarHeight,
                top: 0,
                left: 0,
                zIndex: 2,
                backgroundColor: 'rgba(185, 173, 162)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
            }}
        >
            <button
                onClick={goBack}
            >Go back
            </button>
        </div>
    )
}

export default ToolBar;
