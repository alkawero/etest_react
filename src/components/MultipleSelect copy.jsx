import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AddButton from './AddButton';
import PopUp from './PopUp';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import Conditional from './Conditional';
import { select } from 'redux-saga/effects';
import HorizontalScroll from 'react-scroll-horizontal'

const MultipleSelect = ({ options, value, setSelectedData, placeholder, readOnly = false }) => {
    //data should be [{id:1, value:'', description:'',meta:''}]
    const classes = useStyles()
    const [optionAnchor, setOptionAnchor] = useState(null)
    const [selected, setSelected] = useState([])
    const [availableData, setAvailableData] = useState(options)

    useEffect(() => {
        if (value.length > 0) {
            setSelected(value)
        }
    }, [value]);

    useEffect(() => {
        const selectedIds = selected.map(data => (data.id))
        setAvailableData(options.filter(option => (!selectedIds.includes(option.id))))
        setSelectedData(selected)
        
    }, [selected]);

    useEffect(() => {
        const ids = selected.map(data => (data.id))
        setAvailableData(options.filter(data => (!ids.includes(data.id))))
    }, [options]);

    const handleDelete = (obj) => {
        if (!readOnly)
            setSelected(selected.filter(data => (data.id != obj.id)))
    }

    const onChoose = (obj) => {
        if (!readOnly) {
            setSelected([...selected, obj])
            setOptionAnchor(null)
        }
    }

    const showOption = (event) => {
        setOptionAnchor(optionAnchor ? null : event.currentTarget);
    }



    return (
        <>
            <Grid onClick={(e) => showOption(e)} container alignItems='center' wrap='nowrap' className={classes.root}>
                <span style={{ minWidth: 'fit-content', color: '#979797' }}>{selected.length > 0 ? placeholder + ' : ' : 'select ' + placeholder + '...'}</span>
                <div className={classes.scrollable}>
                    {selected.map(data => (
                        <Tooltip key={data.id} title={data.description + ' ' + data.meta}>
                            <Chip
                                size="small"
                                label={data.value}
                                className={classes.chip}
                                color="primary"
                                onDelete={() => handleDelete(data)}
                            />
                        </Tooltip>
                    ))
                    }
                </div>
            </Grid>
            <PopUp anchor={optionAnchor} position={'bottom'}>
                <List dense className={classes.listPage}>
                    <Conditional condition={availableData.length < 1 && selected.length < 1}>
                        <ListItem key='noitem'>
                            <ListItemText primary={`no ${placeholder} available...`} />
                        </ListItem>
                    </Conditional>
                    {availableData.map(data => (
                        <Tooltip key={data.id} title={data.description}>
                            <ListItem button className={classes.listItem} onClick={() => onChoose(data)}>
                                <ListItemText
                                    primary={
                                        data.description.length < 50 ? data.description : data.description.substring(0, 50) + '...'}
                                    secondary={data.meta ? data.meta : null}
                                />
                            </ListItem>
                        </Tooltip>
                    ))}


                </List>
            </PopUp>
        </>
    );
}

export default MultipleSelect;

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: 150,
        maxWidth: 150,
        height: 38,
        padding: 4,
        borderRadius: 6,
        border: '1px solid #cccccc',
        margin: '0 4px',
    },
    scrollable: {
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        cursor: 'pointer',
        height: 30,
        alignItems: 'center'
    },
    listPage: {
        width: '100%',
        maxHeight: 300,
        overflowY: 'auto'
    },
    listItem: {
        borderRadius: 6,
        '&:hover': {
            background: '#E5E9F2',
            color: 'black',

        }
    },
    chip: {
        margin: '0 2px'
    }
}));