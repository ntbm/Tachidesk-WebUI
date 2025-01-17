import React, { useContext, useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import client from 'util/client';
import ListItemLink from 'components/util/ListItemLink';
import NavbarContext from 'components/context/NavbarContext';
import LoadingPlaceholder from 'components/util/LoadingPlaceholder';

export default function About() {
    const { setTitle, setAction } = useContext(NavbarContext);

    const [about, setAbout] = useState<IAbout>();

    useEffect(() => { setTitle('About'); setAction(<></>); }, []);

    useEffect(() => {
        client.get('/api/v1/settings/about')
            .then((response) => response.data)
            .then((data:IAbout) => {
                setAbout(data);
            });
    }, []);

    if (about === undefined) {
        return <LoadingPlaceholder />;
    }

    const version = () => {
        if (about.buildType === 'Stable') return `${about.version}`;
        return `${about.version}-${about.revision}`;
    };

    const buildTime = () => new Date(about.buildTime * 1000).toUTCString();

    return (
        <List>
            <ListItem>
                <ListItemText primary="Server" secondary={`${about.name} ${about.buildType}`} />
            </ListItem>
            <ListItem>
                <ListItemText primary="Server version" secondary={version()} />
            </ListItem>
            <ListItem>
                <ListItemText primary="Build time" secondary={buildTime()} />
            </ListItem>
            <ListItemLink href={about.github}>
                <ListItemText primary="Github" secondary={about.github} />
            </ListItemLink>
            <ListItemLink href={about.discord}>
                <ListItemText primary="Discord" secondary={about.discord} />
            </ListItemLink>
        </List>
    );
}
