import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import Home from "./page/Home.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom"; // ✅ 이거 추가!
import Layout from "./layout/Layout.tsx";
import Login from "./page/Login.tsx";
import Signup from "./page/Signup.tsx";
import Profile from "./page/Profile.tsx";
import ProfileSubmission from "./page/ProfileSubmission.tsx";
import ProfileSubmissionDetail from "./page/ProfileSubmissionDetail.tsx";
import AppPolicy from "./page/AppPolicy.tsx";
import ProfileEdit from "./page/ProfileEdit.tsx";
import Donation from "./page/Donation.tsx";
import DonationDetail from "./page/DonationDetail.tsx";
import DonationSubmit from "./page/DonationSubmit.tsx";

export const baseUrl = import.meta.env.VITE_API_BASE_URL;

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="login" element={<Login/>}/>
                    <Route path="signup" element={<Signup/>}/>
                    <Route path="profile" element={<Profile/>}/>
                    <Route path="profile/edit" element={<ProfileEdit/>}/>
                    <Route path="profile/submission" element={<ProfileSubmission/>}/>
                    <Route path="profile/submission/detail" element={<ProfileSubmissionDetail/>}/>
                    <Route path="donation" element={<Donation/>}/>
                    <Route path="donation/:donationId" element={<DonationDetail/>}/>
                    <Route path="donation/submit" element={<DonationSubmit/>}/>
                    <Route path="app-policy" element={<AppPolicy/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
