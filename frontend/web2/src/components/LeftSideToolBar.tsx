import React from 'react'
import { BsBuilding } from 'react-icons/bs'
import { GrDocumentConfig } from 'react-icons/gr'
import { Link } from 'react-router-dom'

import "./LeftSideToolBar.css";

export default function LeftSideToolBar() {
    return (
        <div className="leftsidetoolbar-content">
            <Link to={"/estabelecimentos"}>
                <BsBuilding size={26} />
            </Link>
            <Link to={"/novotipoestabelecimento"}>
                <GrDocumentConfig size={26} />
            </Link>
        </div>
    )
}