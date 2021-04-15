import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'

import { Form, Input, Button, Select } from 'antd'

import { v4 as uuidv4 } from 'uuid'

import { ADD_BOAT, GET_BOATS, GET_PEOPLE } from '../../queries'

const AddBoat = () => {
  const [id] = useState(uuidv4())
  const [addBoat] = useMutation(ADD_BOAT)

  const [form] = Form.useForm()
  const [, forceUpdate] = useState()

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({})
  }, [])

  const onFinish = values => {
    const { year, make, model, price } = values

    addBoat({
      variables: {
        id,
        year,
        make,
        model,
        price,
        personId
      },
      optimisticResponse: {
        __typename: 'Mutation',
        addBoat: {
          __typename: 'Boat',
          id,
          year,
          make,
          model,
          price,
          personId
        }
      },
      update: (proxy, { data: { addBoat } }) => {
        const data = proxy.readQuery({ query: GET_BOATS })
        proxy.writeQuery({
          query: GET_BOATS,
          data: {
            ...data,
            boats: [...data.boats, addBoat]
          }
        })
      }
    })
  }

  // I'm getting an error when mapping through the personId's 
  // to display the name... decided to cut it out so the app
  // won't break
  // I then adden a Form item so at least the personId can 
  // be added to the boat manually

  return (
    <Form
      form={form}
      name='add-boat-form'
      layout='inline'
      onFinish={onFinish}
      size='large'
      style={{ marginBottom: '40px' }}
    >
      <Form.Item
        name='year'
        rules={[{ required: true, message: 'Please input a year!' }]}
        style={{ marginBottom: '20px' }}
      >
        <Input placeholder='i.e. 1982' />
      </Form.Item>
      <Form.Item
        name='make'
        rules={[{ required: true, message: 'Please input a make!' }]}
        style={{ marginBottom: '20px' }}
      >
        <Input placeholder='i.e. Yamaha' />
      </Form.Item>
      <Form.Item
        name='model'
        rules={[{ required: true, message: 'Please input a model!' }]}
        style={{ marginBottom: '20px' }}
      >
        <Input placeholder='i.e. 212SX' />
      </Form.Item>
      <Form.Item
        name='price'
        rules={[{ required: true, message: 'Please input a price!' }]}
        style={{ marginBottom: '20px' }}
      >
        <Input placeholder='i.e. 20000' />
      </Form.Item>
      <Form.Item
        name='personId'
        rules={[{ required: true, message: 'Please input a personId!' }]}
        style={{ marginBottom: '20px' }}
      >
        <Input placeholder='i.e. 3' />
      </Form.Item>
      <Select
        name='personId2'
        layout='inline'
        size='large'
        rules={[{ required: true, message: 'Please input a personId!' }]}
        placeholder='i.e. 3'
        style={{ width: '26%', marginBottom: '10px', marginRight: '20px'}}>
            <Select.Option value="select" layout='inline'>
             personId
            </Select.Option>
      </Select>
      <Form.Item shouldUpdate={true}>
        {() => (
          <Button
            type='primary'
            htmlType='submit'
            disabled={
              !form.isFieldsTouched(true) ||
              form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
            Add Boat
          </Button>
        )}
      </Form.Item>
    </Form>
  )
}

export default AddBoat
