export const user = {
    'id':1,
    'name':'alka',
    'role':[{
        'id':1, 
        'code':'super', 
        'name':'Super Admin'}],
    'pages':[
        {
            'id':1,
            'navigation':'Dashboard',
            'path':'/home',
            'access':['R','W','D'],
            'icon':'dashboard',
            'tittle':'Dashboard'
        },
        {
            'id':2,
            'navigation':'Pages',
            'path':'/home/pages',
            'access':['R','W','D'],
            'icon':'view_carousel',
            'tittle':'Pages'
        },
        {
            'id':3,
            'navigation':'Roles',
            'path':'/home/roles',
            'access':['R','W','D'],
            'icon':'group',
            'tittle':'Roles'
        }
    ] }

  export const pages = [
    {
        'id':1,
        'navigation':'Dashboard',
        'path':'/home',
        'access':['R'],
        'icon':'dashboard',
        'tittle':'Dashboard'
    },
    {
        'id':2,
        'navigation':'Pages',
        'path':'/home/pages',
        'access':['R','W','D'],
        'icon':'view_carousel',
        'tittle':'Pages'
    },
    {
        'id':3,
        'navigation':'Roles',
        'path':'/home/roles',
        'access':['R','W','D'],
        'icon':'group',
        'tittle':'Roles'
    }
  ]

  export const accesses = {
      data:[
            {code:'R', value:'read'},
            {code:'W', value:'write'},
            {code:'C', value:'create'},
            {code:'D', value:'delete'}
]}

export const users = {
                data:[
                      {id:'alka', text:'alka'},
                      {id:'simon', text:'simon'},
                      {id:'eko', text:'eko'},
                      {id:'anwar', text:'anwar'}
]}            