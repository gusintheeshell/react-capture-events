import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, waitFor, screen, act } from '@testing-library/react'
import { CapturedEventsList } from './index'

describe('CapturedEventsList Component', () => {
  it('should render toggle button', () => {
    const component = render(<CapturedEventsList />)
    const toggleButton =
      component.container.getElementsByClassName('toggle-button')[0]
    expect(toggleButton).toBeInTheDocument()
  })

  it('should open and close the debug window', async () => {
    render(<CapturedEventsList />)
    const toggleButton = screen.getByTestId('toggle-button')

    await act(async () => {
      userEvent.click(toggleButton)
    })

    const debugWindow = await waitFor(() => {
      const element = screen.getByTestId('debug-window')
      expect(element).not.toBeNull()
      return element
    })

    expect(debugWindow).toBeVisible()

    await act(async () => {
      userEvent.click(toggleButton)
    })

    await waitFor(() => {
      expect(debugWindow).not.toBeVisible()
    })
  })

  it('should switch between individual and table view', async () => {
    render(<CapturedEventsList />)
    const toggleButton = screen.getByTestId('toggle-button')

    await act(async () => {
      userEvent.click(toggleButton)
    })

    const toggleViewButton = await waitFor(() =>
      screen.getByTestId('toggle-view-button'),
    )

    await act(async () => {
      userEvent.click(toggleViewButton)
    })

    const tableView = await waitFor(() => screen.getByTestId('table-view'))
    expect(tableView).toBeVisible()

    await act(async () => {
      userEvent.click(toggleViewButton)
    })

    const individualView = await waitFor(() =>
      screen.getByTestId('individual-view'),
    )
    expect(individualView).toBeVisible()
  })

  it('should clear all events', async () => {
    render(<CapturedEventsList />)
    const toggleButton = screen.getByTestId('toggle-button')

    await act(async () => {
      userEvent.click(toggleButton)
    })

    const clearButton = await waitFor(() => screen.getByTestId('clear-button'))

    await act(async () => {
      userEvent.click(clearButton)
    })

    const noEventsText = await waitFor(() => screen.getByText('No events yet'))
    expect(noEventsText).toBeInTheDocument()
  })
})
