import {
  Body,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const logoUrl =
  "https://res.cloudinary.com/dl7zgwx4o/image/upload/v1734591091/z329nc2hyemqudonxc6m.jpg";

export const EmailOrder = ({ orderDetails = [], totalAmount = 0 }) => {
  return (
    <Html>
      <Head />
      <Preview>Your SellBetter Order Confirmation</Preview>
      <Body style={{
        backgroundColor: "#ffffff",
        fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
      }}>
        <Container style={{
          margin: "0 auto",
          padding: "24px",
          maxWidth: "600px",
        }}>
          {/* Header Section */}
          <Section style={{ padding: "0 0 24px" }}>
            <Img
              src={logoUrl}
              width="150"
              height="40"
              alt="SellBetter"
              style={{ borderRadius: "4px" }}
            />
          </Section>

          <Section style={{ textAlign: "center", padding: "0 0 16px" }}>
            <Text style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#1a1a1a",
              margin: "0 0 8px",
            }}>Order Confirmation</Text>
            <Text style={{
              fontSize: "14px",
              color: "#666666",
              margin: "4px 0",
            }}>Order ID: {orderDetails[0]?.id || 'N/A'}</Text>
            <Text style={{
              fontSize: "14px",
              color: "#666666",
              margin: "4px 0",
            }}>Order Date: {new Date().toLocaleDateString()}</Text>
            <Text style={{
              fontSize: "16px",
              color: "#666666",
              margin: "0",
            }}>Thank you for your purchase!</Text>
          </Section>

          <Hr style={{ borderColor: "#e6e6e6", margin: "16px 0" }} />

          {/* Order Items */}
          <Section style={{ padding: "0" }}>
            <Text style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1a1a1a",
              margin: "0 0 16px",
            }}>Order Details</Text>
            {Array.isArray(orderDetails) &&
              orderDetails.map((item, index) => (
                <Row key={index} style={{ margin: "0 0 16px" }}>
                  <Column style={{ width: "80px", verticalAlign: "top" }}>
                    {(item.imageUrl || item.image) && (
                      <Img
                        src={item.imageUrl || item.image}
                        width="80"
                        height="80"
                        alt={item.title || 'Product'}
                        style={{
                          borderRadius: "4px",
                          border: "1px solid #e6e6e6",
                        }}
                      />
                    )}
                  </Column>
                  <Column style={{ paddingLeft: "16px" }}>
                    <Text style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "#1a1a1a",
                      margin: "0 0 4px",
                    }}>{item.title}</Text>
                    <Text style={{
                      fontSize: "14px",
                      color: "#666666",
                      margin: "0 0 4px",
                    }}>Category: {item.category || 'Uncategorized'}</Text>
                    <Text style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "#1a1a1a",
                      margin: "0",
                    }}>
                      ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                      {item.quantity > 1 && (
                        <span style={{
                          fontSize: "14px",
                          color: "#666666",
                          marginLeft: "8px",
                        }}>
                          × {item.quantity} = ${(Number(item.price) * item.quantity).toFixed(2)}
                        </span>
                      )}
                    </Text>
                  </Column>
                </Row>
              ))}
          </Section>

          <Hr style={{ borderColor: "#e6e6e6", margin: "16px 0" }} />

          {/* Total Section */}
          <Section style={{ padding: "16px 0" }}>
            <Row>
              <Column>
                <Text style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#1a1a1a",
                  textAlign: "right",
                }}>
                  Total Amount: <span style={{ color: "#ff385c" }}>${Number(totalAmount).toFixed(2)}</span>
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={{ borderColor: "#e6e6e6", margin: "16px 0" }} />

          {/* Contact Section */}
          <Section style={{
            padding: "16px 0",
            backgroundColor: "#f9f9f9",
            borderRadius: "4px",
            margin: "16px 0",
          }}>
            <Text style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#1a1a1a",
              margin: "0 0 8px",
              textAlign: "center",
            }}>Need Help?</Text>
            <Text style={{
              fontSize: "14px",
              color: "#666666",
              margin: "4px 0",
              textAlign: "center",
            }}>Email: support@sellbetter.com</Text>
            <Text style={{
              fontSize: "14px",
              color: "#666666",
              margin: "4px 0",
              textAlign: "center",
            }}>Phone: +1 (555) 123-4567</Text>
            <Text style={{
              fontSize: "14px",
              color: "#666666",
              margin: "4px 0",
              textAlign: "center",
            }}>Hours: Monday - Friday, 9:00 AM - 6:00 PM EST</Text>
          </Section>

          {/* Footer */}
          <Section style={{ padding: "24px 0 0" }}>
            <Text style={{
              fontSize: "12px",
              color: "#666666",
              textAlign: "center",
            }}>© 2024 SellBetter. All rights reserved.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailOrder;
