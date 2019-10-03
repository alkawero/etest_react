import React, { useState, useEffect, useContext } from 'react'
import { useSelector } from "react-redux";
import { isEmpty, sortBy } from 'lodash';
import Grid from '@material-ui/core/Grid';
import { useUpdateEffect } from 'react-use';
import clsx from 'clsx';
import { doUpload, doPost, doGet, doPut } from 'apis/api-service';
import useStyles, { selectCustomZindex } from './rancanganStyle'
import { useCommonStyles } from 'themes/commonStyle'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import 'assets/css/react-draft-wysiwyg.css';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import AddButton from 'components/AddButton';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import Conditional from 'components/Conditional';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import PopUp from 'components/PopUp';
import DeleteButton from 'components/DeleteButton';
import Avatar from '@material-ui/core/Avatar';
import { UserContext } from 'contexts/UserContext';
import { default as RSelect } from 'react-select';
import SearchListAsync from 'components/SearchListAsync';
import BottomDrawer from 'components/BottomDrawer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Protected from 'components/Protected';
import StatusChip from 'components/StatusChip';
import DetailButton from 'components/DetailButton';
import CheckButton from 'components/CheckButton';
import TopDrawer from 'components/TopDrawer';
import SoalForm from './../soal/SoalForm';



const RancanganForm = ({ create, update, onClose, rancangan, action, open }) => {

    const classes = useStyles()
    const common = useCommonStyles()

    const user = useContext(UserContext)
    const currentAccess = useSelector(state => state.ui.active_page.access);


    const [errorState, setErrorState] = useState({})

    const [status, setStatus] = useState(0)
    const [openTopDrawer, setOpenTopDrawer] = useState(false)
    const [topDrawerTittle, setTopDrawerTittle] = useState('')

    const [openBottomDrawer, setOpenBottomDrawer] = useState(false)
    const [bottomDrawerTittle, setBottomDrawerTittle] = useState('')

    const [soal, setSoal] = useState(null)
    const [selectedSoal, setSelectedSoal] = useState([])
    const [soalData, setSoalData] = useState([])
    const getSoal = async () => {
        let params = {}
        if (jenjang !== null) {
            params = { ...params, jenjang: jenjang.value }
        }
        if (grade !== null) {
            params = { ...params, grade: grade.value }
        }
        if (subject !== null) {
            params = { ...params, subject: subject.value }
        }

        if (quotaComposition !== null) {
            if (quotaComposition.value !== 'C') {
                params = { ...params, answer_type: quotaComposition.value }
            }
        }

        const response = await doGet('soal', params)
        if (!response.error) {
            const selectedIds = selectedSoal.map(soal => (soal.id))
            const availableData = response.data.filter(data => (!selectedIds.includes(data.id)))
            setSoalData(availableData)
        }

    }



    const [soalQuota, setSoalQuota] = useState(0)
    const soalQuotaChange = (e) => {
        const value = parseInt(e.target.value)
        if (action === 'edit' || action === 'create') {
            if (value > 0) {
                setSoalQuota(value)
                if (quotaComposition === 'M') {
                    setMcComposition(value)
                    setEsComposition(0)
                } else
                    if (quotaComposition === 'E') {
                        setEsComposition(value)
                        setMcComposition(0)
                    } else {
                        setMcComposition(value - 1)
                        setEsComposition(1)
                    }
            }


        }

    }


    const [dataQuotaComposition, setDataQuotaComposition] = useState([])
    const getDataQuotaComposition = async () => {
        const params = { group: 'quota_composition' }
        const response = await doGet('param', params)
        setDataQuotaComposition(response.data.map(j => ({ label: j.value, value: j.char_code })));
    }
    const [quotaComposition, setQuotaComposition] = useState({ value: 'M', label: 'multiple choice' })
    const quotaCompositionChange = (e) => {
        if (action === 'edit' || action === 'create') {
            setQuotaComposition(e)
            if (e.value === 'M') {
                setMcComposition(soalQuota)
                setEsComposition(0)
            } else
                if (e.value === 'E') {
                    setEsComposition(soalQuota)
                    setMcComposition(0)
                }
                else {
                    setEsComposition(1)
                    setMcComposition(soalQuota - 1)
                }
        }

    }

    const [mcComposition, setMcComposition] = useState(0)
    const mcCompositionChange = (e) => {
        const value = parseInt(e.target.value)
        if (action === 'edit' || action === 'create') {
            if ((value < soalQuota) && (value > 0)) {
                setMcComposition(value)
                setEsComposition(soalQuota - value)
            }

        }

    }

    const [esComposition, setEsComposition] = useState(0)
    const esCompositionChange = (e) => {
        const value = parseInt(e.target.value)
        if (action === 'edit' || action === 'create') {

            if ((value < soalQuota) && (value > 0)) {
                setEsComposition(value)
                setMcComposition(soalQuota - value)

            }
        }

    }

    const [collaboration, setCollaboration] = useState('F')

    const [partner, setPartner] = useState(null)
    const addPartner = (user) => {
        setPartner({ id: user.id, name: user.text })
        setCollaboration('P')
        setPopUpAnchor(null)
    }

    const removePartner = (user) => {
        setPartner(null)
        setCollaboration('F')
        setPartnerQuota(0)
    }

    const [partnerQuota, setPartnerQuota] = useState(0)
    const partnerQuotaChange = (e) => {
        const value = parseInt(e.target.value)
        if (action === 'edit' || action === 'create') {
            if (value < soalQuota && value > 0)
                setPartnerQuota(value)
        }


    }

    const [popUpAnchor, setPopUpAnchor] = useState(null)
    const showAddPartner = (e) => {
        setPopUpAnchor(popUpAnchor ? null : e.currentTarget);
    }

    const [dataSubject, setDataSubject] = useState([])
    const [subject, setSubject] = useState(null)
    const subjectChange = (e) => {
        if (action === 'edit' || action === 'create') {
            setSubject(e)
            setSelectedSoal([])
        }

    }
    const getDataSubject = async () => {
        const params = { jenjang: jenjang.value, grade: grade.value }
        const response = await doGet('mapel', params)
        setDataSubject(response.data.map(data => ({ label: data.name, value: data.id })));
    }

    const [dataExamType, setDataExamType] = useState([])
    const [examType, setExamType] = useState(null)
    const examTypeChange = (e) => {
        if (action === 'edit' || action === 'create')
            setExamType(e)
    }
    const getDataExamType = async () => {
        const params = { group: 'exam_type' }
        const response = await doGet('param', params)
        setDataExamType(response.data.map(j => ({ label: j.value, value: j.num_code })));
    }

    const [dataJenjang, setDataJenjang] = useState([])
    const [jenjang, setJenjang] = useState(null)
    const jenjangChange = (e) => {
        if (action === 'edit' || action === 'create')
            setJenjang(e)
    }



    const getDataJenjang = async () => {
        const params = { group: 'jenjang' }
        const response = await doGet('param', params)
        setDataJenjang(response.data.map(j => ({ label: j.value, value: j.char_code })));
    }

    const [dataGrade, setDataGrade] = useState([])
    const [grade, setGrade] = useState(null)
    const gradeChange = (e) => {
        if (action === 'edit' || action === 'create')
            setGrade(e)
    }
    const getDataGrade = async () => {
        if (jenjang !== null) {
            const params = { group: 'grade', key: jenjang.value }
            const response = await doGet('param', params)
            const grades = response.data.map(grade => ({ label: grade.value, value: grade.char_code }))
            setDataGrade(grades);
        }

    }

    useUpdateEffect(() => {
        if (open === false)
            clear()
    }, [open]);


    const [tahunAjaran, setTahunAjaran] = useState('')
    const getTahunAjaran = async () => {
        const params = { group: 'tahun_pelajaran', status: 1, single: 1 }
        const response = await doGet('param', params)
        setTahunAjaran(response.data.value);
    }

    useEffect(() => {
        getTahunAjaran()
        getDataExamType()
        getDataJenjang()
        getDataQuotaComposition()
    }, []);

    useEffect(() => {//setting for detail/edit
        if (rancangan) {
            setExamType({ label: rancangan.exam_type.value, value: rancangan.exam_type.num_code })
            setJenjang({ label: rancangan.jenjang, value: rancangan.jenjang, load: 'first-load' })
            setGrade({ label: rancangan.grade_num, value: rancangan.grade_char, load: 'first-load' })
            setSubject({ label: rancangan.subject_name, value: rancangan.subject_id, load: 'first-load' })
            setSoalQuota(rancangan.soal_quota)
            setQuotaComposition({ label: rancangan.quota_composition.value, value: rancangan.quota_composition.char_code })
            setMcComposition(rancangan.mc_composition)
            setEsComposition(rancangan.es_composition)
            setCollaboration(rancangan.collaboration.char_code)
            if (rancangan.partner_id !== null)
                setPartner({ id: rancangan.partner_id, name: rancangan.partner_name })
            setPartnerQuota(rancangan.partner_quota)
            const sorted = sortBy(rancangan.soals, (soal) => (soal.no))
            setSelectedSoal(sorted)
        }
    },
        [rancangan])

    useUpdateEffect(() => {
        if (action === 'edit' || action === 'create') {
            if (jenjang === null) {
                setGrade(null)
                setDataGrade([])
            } else {
                if (!jenjang.load) {
                    setGrade(null)
                    setDataGrade([])
                }
                getDataGrade()
            }
        }
    }, [jenjang])

    useUpdateEffect(() => {
        if (action === 'edit' || action === 'create') {
            if (grade === null) {
                setSubject(null)
                setDataSubject([])
            } else {
                if (!grade.load) {
                    setSubject(null)
                    setDataSubject([])
                }
                if (jenjang !== null) {
                    getDataSubject()
                }
            }
        }
    }, [grade])


    const showAddSoal = () => {
        getSoal()
        setOpenBottomDrawer(true)
        setBottomDrawerTittle('Add Soal To Rancangan')
    }

    const closeAddSoal = () => {
        setSoalData([])
        setOpenBottomDrawer(false)
    }

    const getById = async (id) => {
        const response = await doGet('soal/' + id)
        if (!response.error) {
            return response.data
        }
    }

    const detail = async (obj) => {
        const soal = await getById(obj.id)
        setSoal(soal)
        setOpenTopDrawer(true)
        setTopDrawerTittle('Soal Detail')
    }

    const closeDetailSoal = () => {
        setSoal(null)
        setOpenTopDrawer(false)
    }

    const chooseSoal = (soal) => {
        const soalWithNo = { ...soal, no: selectedSoal.length + 1, bobot: 0 }
        const added = [...selectedSoal, soalWithNo]
        const sorted = sortBy(added, (soal) => (soal.no))
        setSelectedSoal(sorted)

        closeAddSoal()
    }

    const removeSoal = (removedSoal) => {
        const filtered = selectedSoal.filter(selected => (selected.id !== removedSoal.id))
        let no = 0;
        const arranged = filtered.map(soal => ({ ...soal, no: ++no }))
        setSelectedSoal(arranged)
    }

    const bobotChange = (soal) => (e) => {
        const value = parseFloat(e.target.value)
        if (action === 'edit' || action === 'create')
            if (value > 0) {
                let filtered = selectedSoal.filter(existing => (existing.id !== soal.id))
                soal = { ...soal, bobot: value }
                filtered = [...filtered, soal]
                const sorted = sortBy(filtered, (soal) => (soal.no))
                setSelectedSoal(sorted)
            }

    }

    const cancel = () => {
        clear()
        onClose()
    }

    const submit = () => {
        let errors = {}

        if (jenjang === null) {
            errors = { ...errors, ejenjang: 'please choose jenjang' }
        }

        if (grade === null) {
            errors = { ...errors, egrade: 'please choose grade' }
        }

        if (subject === null) {
            errors = { ...errors, esubject: 'please choose subject' }
        }


        setErrorState(errors)

        if (isEmpty(errors)) {

            let newRancangan = {
                jenjang: jenjang.value,
                grade_char: grade.value,
                grade_num: grade.label,
                subject: subject.value,
                tahun_ajaran_char: tahunAjaran,
                soal_quota: soalQuota,
                quota_composition: quotaComposition.value,
                mc_composition: mcComposition,
                es_composition: esComposition,
                collaboration_type: collaboration,
                partner_quota: partnerQuota,
                creator: user.id,
                status: status,
                exam_type_code: examType.value
            }

            if (partner !== null) {
                newRancangan = { ...newRancangan, partner: partner.id, }
            }

            const soals = selectedSoal.map(soal => ({ id: soal.id, bobot: soal.bobot, soal_num: soal.no, add_by: user.id }))

            newRancangan = { ...newRancangan, soals: soals }

            if (rancangan) {
                newRancangan = { ...newRancangan, id: rancangan.id }
                update(newRancangan)
            } else {
                create(newRancangan)
            }

            clear()
            onClose()
        }

    }

    const clear = () => {
        setExamType(null)
        setJenjang(null)
        setGrade(null)
        setSubject(null)
        setSoalQuota(0)
        setQuotaComposition({ value: 'M', label: 'multiple choice' })
        setMcComposition(0)
        setEsComposition(0)
        setPartner(null)
        setCollaboration('F')
        setPartnerQuota(0)
        setSelectedSoal([])
        setErrorState({})
    }

    return (
        <>
            <Grid container direction='column' className={classes.addContent}>
                <Grid container className={common.paddingX}>
                    <Grid item className={common.marginBottom}>
                        <RSelect
                            value={examType}
                            onChange={examTypeChange}
                            name='exam type'
                            options={dataExamType}
                            placeholder='exam type...'
                            styles={selectCustomZindex}
                        />
                    </Grid>

                    <RSelect
                        value={jenjang}
                        onChange={jenjangChange}
                        name='jenjang'
                        options={dataJenjang}
                        placeholder='jenjang...'
                        styles={selectCustomZindex}
                    />

                    <RSelect
                        value={grade}
                        onChange={gradeChange}
                        name='grade'
                        options={dataGrade}
                        placeholder='grade...'
                        styles={selectCustomZindex}
                    />

                    <RSelect
                        value={subject}
                        onChange={subjectChange}
                        name='subject'
                        options={dataSubject}
                        placeholder='subject...'
                        styles={selectCustomZindex}
                    />

                    <TextField
                        id="soalQuota"
                        value={soalQuota}
                        margin="dense"
                        onChange={soalQuotaChange}
                        variant='outlined'
                        type="number"
                        label='jumlah soal'
                        style={{ margin: '-1px 4px 0 4px', width: 100 }}
                    />

                    <RSelect
                        value={quotaComposition}
                        onChange={quotaCompositionChange}
                        name='bentuk soal'
                        options={dataQuotaComposition}
                        placeholder='bentuk soal...'
                        styles={selectCustomZindex}
                    />

                    <Conditional condition={quotaComposition.value === 'C'}>
                        <TextField
                            id="mcComposition"
                            value={mcComposition}
                            margin="dense"
                            type="number"
                            onChange={mcCompositionChange}
                            variant='outlined'
                            label='multiple choice'
                            style={{ margin: '-1px 4px 0 4px', width: 120 }}
                        />
                    </Conditional>

                    <Conditional condition={quotaComposition.value === 'C'}>
                        <TextField
                            id="esComposition"
                            value={esComposition}
                            margin="dense"
                            onChange={esCompositionChange}
                            variant='outlined'
                            type="number"
                            label='essay'
                            style={{ margin: '-1px 4px 0 4px', width: 60 }}
                        />
                    </Conditional>

                    <Conditional condition={collaboration === 'P'}>
                        <TextField
                            id="myQuota"
                            value={soalQuota - partnerQuota}
                            margin="dense"
                            variant='outlined'
                            type="number"
                            label='my quota'
                            style={{ margin: '-1px 4px 0 4px', width: 80 }}
                        />
                    </Conditional>


                    <Conditional condition={collaboration === 'F' && (action === 'edit' || action === 'create')}>
                        <Grid container item xs={2} alignItems='center' style={{ height: 40 }}>
                            <AddButton text='Add Partner' action={showAddPartner} classes={common.marginX} />
                        </Grid>
                    </Conditional>
                    <Conditional condition={collaboration === 'P'}>
                        <Grid wrap='nowrap' container item xs={3} alignItems='center' justify='space-around' style={{ height: 40 }}>
                            <Chip
                                label={partner !== null && 'partner : ' + partner.name.substring(0, 15)}
                                onDelete={removePartner}
                                className={classes.chip}
                                color="primary"
                            />
                            <TextField
                                id="partnerQuota"
                                value={partnerQuota}
                                margin="dense"
                                onChange={partnerQuotaChange}
                                variant='outlined'
                                type="number"
                                label='partner quota'
                                style={{ margin: '-1px 4px 0 4px', width: 100 }}
                            />
                        </Grid>

                    </Conditional>

                    <Conditional condition={action === 'edit' || action === 'create'}>
                        <Grid container item xs={2} alignItems='center' style={{ height: 40 }}>
                            <AddButton text='Add Soal' action={showAddSoal} classes={common.marginX} />
                        </Grid>
                    </Conditional>
                    <span style={{ color: 'red', margin: '0 16px' }}>{errorState.ejenjang}</span>
                    <span style={{ color: 'red', margin: '0 16px' }}>{errorState.egrade}</span>
                    <span style={{ color: 'red', margin: '0 16px' }}>{errorState.esubject}</span>

                </Grid>
                <Grid container className={clsx(classes.table_wrapper, common.borderTopRadius, common.marginTop)}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow className={classes.table_header}>
                                <TableCell className={common.borderTopLeftRadius}>No</TableCell>
                                <TableCell>KD</TableCell>
                                <TableCell>Materi</TableCell>
                                <TableCell>Ranah</TableCell>
                                <TableCell>Pembuat</TableCell>
                                <TableCell>Bentuk</TableCell>
                                <TableCell className={common.borderTopRightRadius}>Status</TableCell>
                                <TableCell>Bobot</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selectedSoal.map(row => (
                                <TableRow key={row.id} className={classes.tableRow}>

                                    <TableCell>
                                        {row.no}
                                    </TableCell>
                                    <TableCell>{row.kds.join(',')}</TableCell>
                                    <TableCell>{row.materis.join(',')}</TableCell>
                                    <TableCell>{row.ranahs.join(',')}</TableCell>
                                    <TableCell>{row.creator_name}</TableCell>
                                    <TableCell>{row.type_name}</TableCell>
                                    <TableCell>
                                        <StatusChip status={row.active} />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            id="bobot"
                                            value={row.bobot}
                                            margin="dense"
                                            onChange={bobotChange(row)}
                                            variant='outlined'
                                            type="number"
                                            label='bobot'
                                            style={{ margin: '-1px 4px 0 4px', width: 60 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Grid container wrap='nowrap'>
                                            <DetailButton tooltip='detail' action={() => detail(row)} classes={classes.floatButton} />
                                            <Conditional condition={action === 'edit' || action === 'create'}>
                                                <Protected current={currentAccess} only='D'>
                                                    <DeleteButton tooltip='remove soal' action={() => removeSoal(row)} classes={classes.floatButton} />
                                                </Protected>
                                            </Conditional>
                                        </Grid>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </Grid>


                <Conditional condition={action === 'edit' || action === 'create'}>
                    <Grid item container justify='space-between' className={classes.addAction}>
                        <Grid item>
                            <Button variant='outlined' onClick={cancel} >cancel</Button>
                            <Button variant='outlined' onClick={clear} className={common.marginLeft}>reset</Button>
                        </Grid>
                        <Button onClick={submit} color='primary' variant='contained'>Save</Button>

                    </Grid>
                </Conditional>
            </Grid>

            <PopUp anchor={popUpAnchor} position='bottom'>
                <SearchListAsync path={'user'} action={addPartner} />
            </PopUp>

            <BottomDrawer tittle={bottomDrawerTittle} open={openBottomDrawer} close={closeAddSoal}>
                <Grid item xs={12} container className={clsx(classes.table_wrapper, common.borderTopRadius)}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow className={classes.table_header}>
                                <TableCell className={common.borderTopLeftRadius}>Pelajaran</TableCell>
                                <TableCell>Jenjang</TableCell>
                                <TableCell>Kelas</TableCell>
                                <TableCell>KD</TableCell>
                                <TableCell>Materi</TableCell>
                                <TableCell>Ranah</TableCell>
                                <TableCell>Pembuat</TableCell>
                                <TableCell>Bentuk</TableCell>
                                <TableCell className={common.borderTopRightRadius}>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {soalData.map(row => (
                                <TableRow key={row.id} className={classes.tableRow}>

                                    <TableCell>
                                        {row.subject_name}
                                    </TableCell>
                                    <TableCell >{row.jenjang}</TableCell>
                                    <TableCell>{row.grade_num}</TableCell>
                                    <TableCell>{row.kds.join(',')}</TableCell>
                                    <TableCell>{row.materis.join(',')}</TableCell>
                                    <TableCell>{row.ranahs.join(',')}</TableCell>
                                    <TableCell>{row.creator_name}</TableCell>
                                    <TableCell>{row.type_name}</TableCell>
                                    <TableCell>
                                        <StatusChip status={row.active} />
                                    </TableCell>
                                    <TableCell>
                                        <Grid container wrap='nowrap'>
                                            <DetailButton tooltip='detail' action={() => detail(row)} classes={classes.floatButton} />
                                            <CheckButton tooltip='choose soal' action={() => chooseSoal(row)} classes={classes.floatButton} />
                                        </Grid>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                        <TableHead>
                            <TableRow className={classes.table_header}>
                                <TableCell>Pelajaran</TableCell>
                                <TableCell>Jenjang</TableCell>
                                <TableCell>Kelas</TableCell>
                                <TableCell>KD</TableCell>
                                <TableCell>Materi</TableCell>
                                <TableCell>Ranah</TableCell>
                                <TableCell>Pembuat</TableCell>
                                <TableCell>Bentuk</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                </Grid>
            </BottomDrawer>

            <TopDrawer tittle={topDrawerTittle} open={openTopDrawer} close={closeDetailSoal}>
                <SoalForm action='detail' soal={soal} onClose={closeDetailSoal} />
            </TopDrawer>
        </>

    );
}

export default RancanganForm;

