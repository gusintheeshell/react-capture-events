import React, { useState, useRef, useEffect, lazy, Suspense } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  List,
  Table as TableIcon,
  RefreshCcw,
  Trash,
} from "lucide-react";
import "./styles.css";
import Icon from "../Icon";

const ReactJson = lazy(() => import("react-json-view"));

interface EventData {
  eventName: string;
  eventData: Record<string, any>;
  timestamp: string;
}

export const CapturedEventsList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewType, setViewType] = useState<"individual" | "table">(
    "individual"
  );
  const [events, setEvents] = useState<EventData[]>([]);
  const dragRef = useRef<HTMLDivElement>(null);

  const resetPosition = () => setPosition({ x: 0, y: 0 });
  const toggleWindow = () => {
    setIsOpen((prev) => !prev);
    resetPosition();
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.target === dragRef.current) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition((prevPosition) => ({
        x: prevPosition.x + e.movementX,
        y: prevPosition.y - e.movementY,
      }));
    }
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const refresh = async () => {
    await fetchEventsFromSW();
  };

  const fetchEventsFromSW = async () => {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "GET_EVENTS" });

      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "EVENTS_LIST") {
          setEvents(event.data.events);
        }
      });
    }
  };

  const clearAllEvents = async () => {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "CLEAR_EVENTS" });
      setEvents([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    fetchEventsFromSW();
  }, [events]);

  const nextItem = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  const prevItem = () => {
    setSelectedIndex(
      (prevIndex) => (prevIndex - 1 + events.length) % events.length
    );
  };

  const toggleViewType = () => {
    setViewType((prevType) =>
      prevType === "individual" ? "table" : "individual"
    );
  };

  const renderIndividualView = () => (
    <>
      <div className="control-panel">
        <button className="icon-button" onClick={prevItem}>
          <ChevronLeft size={16} />
        </button>
        <span>
          Item {selectedIndex + 1} of {events.length}
        </span>
        <button className="icon-button" onClick={nextItem}>
          <ChevronRight size={16} />
        </button>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ReactJson src={events[selectedIndex]} theme="monokai" />
      </Suspense>
    </>
  );

  const renderTableView = () => {
    const allKeys = Array.from(
      new Set(events.flatMap((obj) => Object.keys(obj)))
    );
    return (
      <table className="table">
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
                  {typeof item[key as keyof EventData] === "object"
                    ? JSON.stringify(item[key as keyof EventData])
                    : String(item[key as keyof EventData] || "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <button className="toggle-button" onClick={toggleWindow}>
        {isOpen ? <X size={24} /> : <Icon />}
      </button>

      {isOpen && (
        <div
          className="debug-window"
          style={{
            bottom: `calc(20px + ${position.y}px)`,
            right: `calc(16px - ${position.x}px)`,
            cursor: isDragging ? "grabbing" : "auto",
          }}
        >
          <div className="debug-header" ref={dragRef} onMouseDown={onMouseDown}>
            <span className="header-title">React Capture Events</span>
            <div className="header-actions">
              <button className="icon-button" onClick={clearAllEvents}>
                <Trash size={16} />
              </button>
              <button className="icon-button" onClick={refresh}>
                <RefreshCcw size={16} />
              </button>
              <button className="icon-button" onClick={toggleViewType}>
                {viewType === "individual" ? (
                  <TableIcon size={16} />
                ) : (
                  <List size={16} />
                )}
              </button>
              <button className="icon-button" onClick={toggleWindow}>
                <X size={16} />
              </button>
            </div>
          </div>
          <div className="debug-content">
            {viewType === "individual"
              ? renderIndividualView()
              : renderTableView()}
          </div>
        </div>
      )}
    </>
  );
};
