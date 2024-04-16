"use client";
import { Modal, ModalContent, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface RouteModalProps {
	children: React.ReactNode;
	Actions?: (onClose: () => any) => React.ReactNode;
}
export default function RouteModal({ children, Actions }: RouteModalProps) {
	const { isOpen, onOpenChange } = useDisclosure({ defaultOpen: true });
	const router = useRouter();

	// When the modal closes, wait 300ms for the animation to finish before updating the route
	// Next.js would unmount the modal component before the animation finishes, so we need to use a timeout
	useEffect(() => {
		if (isOpen) return;
		const timeout = setTimeout(() => router.back(), 300);
		return () => clearTimeout(timeout);
	}, [isOpen]);

	return (
		// Bottom on mobile, center on desktop
		<Modal isOpen={isOpen} size="4xl" placement="bottom-center" onOpenChange={onOpenChange}>
			<ModalContent>
				{(onClose) => (
					<>
						{children}
						<ModalFooter>
							<Button color="danger" variant="light" onPress={onClose}>
								Close
							</Button>
							{Actions && Actions(onClose)}
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
