import { Head } from '@inertiajs/react'
import { SideMenu } from '../Components/SideMenu'

export default function Top({}) {
    return (
        <>
            <Head title="Top" />
            <SideMenu />
            <h1>AI英会話アプリのトップ</h1>
        </>
    )
}