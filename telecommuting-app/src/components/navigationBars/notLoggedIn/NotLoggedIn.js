import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Link } from '@mui/material';

export default function NotLoggedIn() {
  return (
    <AppBar position="static">
      <Toolbar>
        <div className="left">
          <Link href="/">Nexus Care</Link>
        </div>
        <div className="center">
          <Link href="">About</Link>
          <Link href="">What we do</Link>
          <Link href="">Foundation</Link>
          <Link href="">Investors</Link>
        </div>
        <div className="right">
          <Link href="/login">Login</Link>
        </div>
      </Toolbar>
      <div id="body">

      </div>
    </AppBar>
  );
}
