# react-drag-and-drop-hook-ts
This react hook allows easy set up for drag and drop class switching and drop handlers.

For a working example, view the code sandbox [here](https://codesandbox.io/p/devbox/react-drag-and-drop-hook-ts-pwgvyh), or see below.

*Notes: I'm using react-bootstrap in the example code for easy styling here, but it is not in any way required for use with this hook.*

In this example we are spreading both the draggable props and the droppable props provided by the hook on each element, making each element both draggable and droppable, but you can of course keep the draggable and droppable elements separate and use however you like. This example allows the user to use dragging and dropping to sort the Card elements in any order.

**Example usage:**

```
import React, { useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import "./App.css";

interface Discussion {
  id: number;
  title: string;
  description: string;
}

const App: React.FC = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([
    { id: 1, title: "Discussion 1", description: "Description 1" },
    { id: 2, title: "Discussion 2", description: "Description 2" },
    { id: 3, title: "Discussion 3", description: "Description 3" },
  ]);

  const { getDraggableProps, getDroppableProps } = useDragAndDrop({
    baseDroppableClassString: "bg-success bg-opacity-10 draggable-cards",
    dragActiveDroppableClassString:
      "ordering-droppable opacity-50 border-primary border-2",
    dragActiveDroppableHoverClassString:
      "ordering-droppable-dragover opacity-50 border-primary border-2",
    dropHandler: (
      draggedElementData: string,
      droppableElementData: string | null,
    ) => {
      const dragIndex = parseInt(draggedElementData, 10);
      const dropIndex = droppableElementData
        ? parseInt(droppableElementData, 10)
        : null;

      if (dropIndex !== null && dragIndex !== dropIndex) {
        const orderedDiscussions = [...discussions];
        [orderedDiscussions[dragIndex], orderedDiscussions[dropIndex]] = [
          orderedDiscussions[dropIndex],
          orderedDiscussions[dragIndex],
        ];
        setDiscussions(orderedDiscussions);
      }
    },
  });

  return (
    <Row className="row-cols-1 row-cols-sm-2 row-cols-lg-3 discussion-cards g-4 m-4">
      {discussions.map((discussion, index) => (
        <Col key={discussion.id} style={{ cursor: "grab" }}>
          <Card
            {...getDraggableProps(discussion.id.toString(), index.toString())}
            {...getDroppableProps(discussion.id.toString(), index.toString())}
          >
            <Card.Body>
              <Card.Title>{discussion.title}</Card.Title>
              <Card.Text>{discussion.description}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default App;
```
