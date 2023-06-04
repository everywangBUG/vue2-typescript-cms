import type { IModalConfig } from '@/components/page-modal/type'

const modalConfig: IModalConfig = {
  header: {
    newTitle: '新建部门',
    editTitle: '编辑部门'
  },
  propList: [
    {
      type: 'input',
      label: '部门名称',
      prop: 'name',
      placeholder: '请输入部门名称',
      initialValue: ''
    },
    {
      type: 'input',
      label: '部门领导',
      prop: 'leader',
      placeholder: '请输入部门领导名字',
      initialValue: ''
    },
    {
      type: 'select',
      label: '上级部门',
      prop: 'parentId',
      placeholder: '请选择上级部门',
      options: []
    }
  ]
}

export default modalConfig
