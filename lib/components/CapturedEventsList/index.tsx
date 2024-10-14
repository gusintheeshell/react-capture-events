import React, {
  useState,
  useRef,
  useEffect,
  lazy,
  Suspense,
  useCallback,
} from 'react'
import {
  X,
  ChevronRight,
  ChevronLeft,
  List,
  Table as TableIcon,
  RefreshCcw,
  Trash,
} from 'lucide-react'
import './styles.css'
import Icon from '../Icon'

import logo from '../../../src/assets/react-capture-events.svg'

const ReactJson = lazy(() => import('react-json-view'))

interface EventData {
  eventName: string
  eventData: Record<string, any>
  timestamp: string
}

export const CapturedEventsList = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [viewType, setViewType] = useState<'individual' | 'table'>('individual')
  const [events, setEvents] = useState<EventData[]>([])
  const dragRef = useRef<HTMLDivElement>(null)

  const resetPosition = () => setPosition({ x: 0, y: 0 })
  const toggleWindow = () => {
    setIsOpen((prev) => !prev)
    resetPosition()
  }

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.target === dragRef.current) {
      setIsDragging(true)
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition((prevPosition) => ({
        x: prevPosition.x + e.movementX,
        y: prevPosition.y - e.movementY,
      }))
    }
  }

  const onMouseUp = () => {
    setIsDragging(false)
  }

  const refresh = async () => {
    await fetchEventsFromSW()
  }

  const fetchEventsFromSW = async () => {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'GET_EVENTS' })

      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'EVENTS_LIST') {
          setEvents(event.data.events)
        }
      })
    }
  }

  const clearAllEvents = useCallback(async () => {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_EVENTS' })
      setEvents([])
    }
  }, [events, setEvents])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [isDragging])

  useEffect(() => {
    fetchEventsFromSW()
  }, [events])

  const nextItem = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % events.length)
  }

  const prevItem = () => {
    setSelectedIndex(
      (prevIndex) => (prevIndex - 1 + events.length) % events.length,
    )
  }

  const toggleViewType = () => {
    setViewType((prevType) =>
      prevType === 'individual' ? 'table' : 'individual',
    )
  }

  const renderIndividualView = useCallback(
    () => (
      <>
        <div className="control-panel" data-testid="individual-view">
          <button
            className="icon-button"
            onClick={prevItem}
            data-testid="prev-button"
          >
            <ChevronLeft size={16} />
          </button>
          {events.length > 0 ? (
            <span data-testid="event-counter">
              Item {selectedIndex + 1} of {events.length}
            </span>
          ) : (
            <span data-testid="no-events">No events yet</span>
          )}
          <button
            className="icon-button"
            onClick={nextItem}
            data-testid="next-button"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <ReactJson src={events[selectedIndex]} theme="monokai" />
        </Suspense>
      </>
    ),
    [events, selectedIndex],
  )

  const renderTableView = () => {
    const allKeys = Array.from(
      new Set(events.flatMap((obj) => Object.keys(obj))),
    )
    return (
      <table className="table" data-testid="table-view">
        <thead>
          <tr>
            {allKeys.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {events.map((item, index) => (
            <tr key={index}>
              {allKeys.map((key) => (
                <td key={`${index}-${key}`}>
                  {typeof item[key as keyof EventData] === 'object'
                    ? JSON.stringify(item[key as keyof EventData])
                    : String(item[key as keyof EventData] || '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <>
      <button
        data-event="click"
        data-action="toggle-debug-window"
        data-component="button"
        data-testid="toggle-button"
        className="toggle-button"
        onClick={toggleWindow}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <Icon src={logo} alt="Logo" width={48} height={48} />
        )}
      </button>

      {isOpen && (
        <div
          data-testid="debug-window"
          className="debug-window"
          style={{
            bottom: `calc(20px + ${position.y}px)`,
            right: `calc(16px - ${position.x}px)`,
            cursor: isDragging ? 'grabbing' : 'auto',
          }}
        >
          <div
            className="debug-header"
            ref={dragRef}
            onMouseDown={onMouseDown}
            data-testid="debug-header"
          >
            <span className="header-title" data-testid="header-title">
              React Capture Events
            </span>
            {/* <div data-testid="event-counter">{events.length}</div> */}
            <div className="header-actions">
              <button
                className="icon-button"
                onClick={clearAllEvents}
                data-testid="clear-button"
              >
                <Trash size={16} />
              </button>
              <button
                className="icon-button"
                onClick={refresh}
                data-testid="refresh-button"
              >
                <RefreshCcw size={16} />
              </button>
              <button
                className="icon-button"
                onClick={toggleViewType}
                data-testid="toggle-view-button"
              >
                {viewType === 'individual' ? (
                  <TableIcon size={16} />
                ) : (
                  <List size={16} />
                )}
              </button>
              <button
                className="icon-button"
                onClick={toggleWindow}
                data-testid="close-button"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          <div className="debug-content" data-testid="debug-content">
            {viewType === 'individual'
              ? renderIndividualView()
              : renderTableView()}
          </div>
        </div>
      )}
    </>
  )
}
