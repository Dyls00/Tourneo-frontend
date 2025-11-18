/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useUser } from "../user";
import { useNavigate } from "react-router";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import Input from "@material-ui/core/Input";
import Button from '@mui/material/Button';


export const Login: React.FC = () => {

        const {login} = useUser();

        const navigate = useNavigate();

        const { control, handleSubmit } = useForm({
            defaultValues: {
            email: '',
            password: '',
            }
        });

    function handleLogin(){
        login({
                name: "Johane",
                avatar: "https://picsum.photos/seed/remy/200"
            });
    };

    const onSubmit: SubmitHandler<IFormInput> = data => {
            if(data.password == "azerty"){
            handleLogin();
            navigate("/")
        } else{
            console.log(data.password)
        }
    };

    interface IFormInput {
    email: string;
    password: string;
    }

  return (
    <form className="form_container" action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="elements">
            <div className="title_container">
                <p className="title">Login to your Account</p>
                <span className="subtitle">
                Get started with our app — just sign in and enjoy the experience.
                </span>
            </div>

            <div className="_input">
            <label htmlFor="Email">Email</label>
            <Controller
                name="email"
                rules={{ required: true }}
                control={control}
                render={({ field }) => <Input {...field} />}
            />
            </div>

            <div className="_input">
                <label htmlFor="password">Mot de passe</label>
                <Controller
                name="password"
                rules={{ required: true }}
                control={control}
                render={({ field }) => <Input {...field} />}
                />
            </div>

            <Button variant="contained" type="submit" className="sign-in_btn">Sign in </Button>

            <div className="separator">
                <hr className="line" />
                <span className="_span">Or</span>
                <hr className="line" />
            </div>
            <Button variant="outlined" className="sign-in_btn">Sign in with Google</Button>
        </div>
    </form>
  );
};
